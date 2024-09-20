use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

// Declare the program ID
declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod prediction_market {
    use super::*;

    /// Initialize the prediction market
    /// This function sets up the main prediction market account
    pub fn initialize(ctx: Context<Initialize>, usdt_mint: Pubkey, oracle: Pubkey) -> Result<()> {
        let prediction_market = &mut ctx.accounts.prediction_market;
        prediction_market.usdt_mint = usdt_mint;
        prediction_market.oracle = oracle;
        prediction_market.owner = *ctx.accounts.owner.key;
        Ok(())
    }

    /// Create a new prediction pool
    /// This function creates a new pool with YES and NO token mints
    pub fn create_pool(ctx: Context<CreatePool>, pool_id: [u8; 32], start_time: i64, end_time: i64) -> Result<()> {
        require!(ctx.accounts.prediction_market.owner == *ctx.accounts.owner.key, PredictionMarketError::NotOwner);
        
        let pool = &mut ctx.accounts.pool;
        pool.id = pool_id;
        pool.start_time = start_time;
        pool.end_time = end_time;
        pool.pool_amount = 0;
        pool.status = PoolStatus::Active;
        pool.yes_token_mint = ctx.accounts.yes_token_mint.key();
        pool.no_token_mint = ctx.accounts.no_token_mint.key();
        pool.bump = ctx.bumps.pool;
        pool.total_winning_tokens = 0; // Initialize to 0, will be set when result is declared

        Ok(())
    }

    /// Vote in a prediction pool
    /// Users can vote YES or NO by transferring USDT and receiving corresponding tokens
    pub fn vote(ctx: Context<Vote>, amount: u64, vote_yes: bool) -> Result<()> {
        let pool = &mut ctx.accounts.pool;
        let current_timestamp = Clock::get()?.unix_timestamp;
        
        // Check if the pool is active and within the voting timeframe
        require!(current_timestamp <= pool.end_time, PredictionMarketError::PoolEnded);
        require!(current_timestamp >= pool.start_time, PredictionMarketError::PoolNotStarted);
        require!(pool.status == PoolStatus::Active, PredictionMarketError::PoolNotActive);

        // Update the pool amount
        pool.pool_amount = pool.pool_amount.checked_add(amount).unwrap();

        // Transfer USDT tokens from user to pool
        let cpi_accounts = Transfer {
            from: ctx.accounts.user_usdt_account.to_account_info(),
            to: ctx.accounts.pool_usdt_account.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, amount)?;

        // Mint YES or NO tokens to user
        let seeds = &[
            pool.to_account_info().key.as_ref(),
            &[pool.bump],
        ];
        let signer = &[&seeds[..]];
        let cpi_accounts = token::MintTo {
            mint: if vote_yes { ctx.accounts.yes_token_mint.to_account_info() } else { ctx.accounts.no_token_mint.to_account_info() },
            to: if vote_yes { ctx.accounts.user_yes_token_account.to_account_info() } else { ctx.accounts.user_no_token_account.to_account_info() },
            authority: pool.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        token::mint_to(cpi_ctx, amount)?;

        Ok(())
    }

    /// Declare the result of a prediction pool
    /// Only the oracle can call this function to set the winner
    pub fn declare_result(ctx: Context<DeclareResult>, winner: u8) -> Result<()> {
        let prediction_market = &ctx.accounts.prediction_market;
        let pool = &mut ctx.accounts.pool;

        require!(*ctx.accounts.oracle.key == prediction_market.oracle, PredictionMarketError::NotOracle);
        require!(pool.status == PoolStatus::Active, PredictionMarketError::PoolNotActive);

        pool.winner = winner;
        pool.status = PoolStatus::Ended;

        // Set the total winning tokens at the time of result declaration
        pool.total_winning_tokens = if winner == 1 {
            ctx.accounts.yes_token_mint.supply
        } else {
            ctx.accounts.no_token_mint.supply
        };

        Ok(())
    }

    /// Set a new oracle for the prediction market
    /// Only the owner can change the oracle
    pub fn set_oracle(ctx: Context<SetOracle>, new_oracle: Pubkey) -> Result<()> {
        require!(ctx.accounts.prediction_market.owner == *ctx.accounts.owner.key, PredictionMarketError::NotOwner);
        ctx.accounts.prediction_market.oracle = new_oracle;
        Ok(())
    }

    /// Claim rewards from an ended prediction pool
    /// Users can claim their rewards based on their winning votes
    pub fn claim(ctx: Context<Claim>) -> Result<()> {
        let pool = &ctx.accounts.pool;
        let current_timestamp = Clock::get()?.unix_timestamp;
        
        require!(current_timestamp > pool.end_time, PredictionMarketError::PoolNotEnded);
        require!(pool.status == PoolStatus::Ended, PredictionMarketError::ResultNotDeclared);

        let winning_token_account = if pool.winner == 1 { 
            &ctx.accounts.user_yes_token_account 
        } else { 
            &ctx.accounts.user_no_token_account 
        };

        let user_winning_balance = winning_token_account.amount;
        let total_winning_tokens = pool.total_winning_tokens;

        // Calculate reward based on the user's proportion of winning tokens
        let reward_amount = (user_winning_balance as u128)
            .checked_mul(pool.pool_amount as u128)
            .unwrap()
            .checked_div(total_winning_tokens as u128)
            .unwrap() as u64;

        // Transfer reward (USDT) tokens to user
        let seeds = &[
            pool.to_account_info().key.as_ref(),
            &[pool.bump],
        ];
        let signer = &[&seeds[..]];
        let cpi_accounts = Transfer {
            from: ctx.accounts.pool_usdt_account.to_account_info(),
            to: ctx.accounts.user_usdt_account.to_account_info(),
            authority: pool.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        token::transfer(cpi_ctx, reward_amount)?;

        // Burn the user's winning tokens
        let cpi_accounts = token::Burn {
            mint: winning_token_account.to_account_info(),
            from: winning_token_account.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::burn(cpi_ctx, user_winning_balance)?;

        Ok(())
    }

    /// Pause an active prediction pool
    /// Only the owner can pause a pool
    pub fn pause_pool(ctx: Context<PausePool>) -> Result<()> {
        require!(ctx.accounts.prediction_market.owner == *ctx.accounts.owner.key, PredictionMarketError::NotOwner);
        ctx.accounts.pool.status = PoolStatus::Paused;
        Ok(())
    }
}

/// The main prediction market account structure
#[account]
pub struct PredictionMarket {
    pub usdt_mint: Pubkey,
    pub oracle: Pubkey,
    pub owner: Pubkey,
}

/// The structure for individual prediction pools
#[account]
pub struct Pool {
    pub id: [u8; 32],
    pub start_time: i64,
    pub end_time: i64,
    pub pool_amount: u64,
    pub status: PoolStatus,
    pub winner: u8,
    pub yes_token_mint: Pubkey,
    pub no_token_mint: Pubkey,
    pub bump: u8,
    pub total_winning_tokens: u64, // New field to store total winning tokens
}

/// The possible statuses of a prediction pool
#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum PoolStatus {
    Active,
    Paused,
    Ended,
}

/// Accounts required for initializing the prediction market
#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = owner, space = 8 + 32 + 32 + 32)]
    pub prediction_market: Account<'info, PredictionMarket>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

/// Accounts required for creating a new prediction pool
#[derive(Accounts)]
#[instruction(pool_id: [u8; 32])]
pub struct CreatePool<'info> {
    #[account(mut)]
    pub prediction_market: Account<'info, PredictionMarket>,
    #[account(
        init,
        payer = owner,
        space = 8 + 32 + 8 + 8 + 8 + 1 + 1 + 32 + 32 + 1 + 8, // Added 8 for total_winning_tokens
        seeds = [b"pool".as_ref(), &pool_id],
        bump
    )]
    pub pool: Account<'info, Pool>,
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(
        init,
        payer = owner,
        mint::authority = pool,
        mint::decimals = 6,
        seeds = [b"yes_token", pool.key().as_ref()],
        bump
    )]
    pub yes_token_mint: Account<'info, Mint>,
    #[account(
        init,
        payer = owner,
        mint::authority = pool,
        mint::decimals = 6,
        seeds = [b"no_token", pool.key().as_ref()],
        bump
    )]
    pub no_token_mint: Account<'info, Mint>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

/// Accounts required for voting in a prediction pool
#[derive(Accounts)]
pub struct Vote<'info> {
    #[account(mut)]
    pub pool: Account<'info, Pool>,
    pub user: Signer<'info>,
    #[account(mut)]
    pub user_usdt_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub pool_usdt_account: Account<'info, TokenAccount>,
    #[account(mut, address = pool.yes_token_mint)]
    pub yes_token_mint: Account<'info, Mint>,
    #[account(mut, address = pool.no_token_mint)]
    pub no_token_mint: Account<'info, Mint>,
    #[account(mut)]
    pub user_yes_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub user_no_token_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

/// Accounts required for declaring the result of a prediction pool
#[derive(Accounts)]
pub struct DeclareResult<'info> {
    pub prediction_market: Account<'info, PredictionMarket>,
    #[account(mut)]
    pub pool: Account<'info, Pool>,
    pub oracle: Signer<'info>,
    #[account(address = pool.yes_token_mint)]
    pub yes_token_mint: Account<'info, Mint>,
    #[account(address = pool.no_token_mint)]
    pub no_token_mint: Account<'info, Mint>,
}

/// Accounts required for setting a new oracle
#[derive(Accounts)]
pub struct SetOracle<'info> {
    #[account(mut)]
    pub prediction_market: Account<'info, PredictionMarket>,
    pub owner: Signer<'info>,
}

/// Accounts required for claiming rewards from a prediction pool
#[derive(Accounts)]
pub struct Claim<'info> {
    #[account(mut)]
    pub pool: Account<'info, Pool>,
    pub user: Signer<'info>,
    #[account(mut)]
    pub user_usdt_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub pool_usdt_account: Account<'info, TokenAccount>,
    #[account(mut, address = pool.yes_token_mint)]
    pub yes_token_mint: Account<'info, Mint>,
    #[account(mut, address = pool.no_token_mint)]
    pub no_token_mint: Account<'info, Mint>,
    #[account(mut)]
    pub user_yes_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub user_no_token_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

/// Accounts required for pausing a prediction pool
#[derive(Accounts)]
pub struct PausePool<'info> {
    pub prediction_market: Account<'info, PredictionMarket>,
    #[account(mut)]
    pub pool: Account<'info, Pool>,
    pub owner: Signer<'info>,
}

/// Custom error codes for the prediction market program
#[error_code]
pub enum PredictionMarketError {
    #[msg("Not the owner")]
    NotOwner,
    #[msg("Pool has ended")]
    PoolEnded,
    #[msg("Pool has not started")]
    PoolNotStarted,
    #[msg("Pool is not active")]
    PoolNotActive,
    #[msg("Not the oracle")]
    NotOracle,
    #[msg("Pool has not ended yet")]
    PoolNotEnded,
    #[msg("Result has not been declared")]
    ResultNotDeclared,
}