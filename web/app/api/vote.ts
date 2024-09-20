import { Keypair, PublicKey } from '@solana/web3.js';
import { Program, BN } from '@project-serum/anchor';
import { TOKEN_PROGRAM_ID, Token, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';

export const vote = async (
  program: Program,
  payer: Keypair,
  poolPubkey: PublicKey,
  amount: number,
  voteYes: boolean
): Promise<void> => {
  const pool = await program.account.pool.fetch(poolPubkey);
  const userUsdtAccount = await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    new PublicKey(pool.usdtMint),
    payer.publicKey
  );

  const poolUsdtAccount = await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    new PublicKey(pool.usdtMint),
    poolPubkey,
    true
  );

  const userYesTokenAccount = await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    new PublicKey(pool.yesTokenMint),
    payer.publicKey
  );

  const userNoTokenAccount = await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    new PublicKey(pool.noTokenMint),
    payer.publicKey
  );

  await program.rpc.vote(new BN(amount), voteYes, {
    accounts: {
      pool: poolPubkey,
      user: payer.publicKey,
      userUsdtAccount,
      poolUsdtAccount,
      yesTokenMint: new PublicKey(pool.yesTokenMint),
      noTokenMint: new PublicKey(pool.noTokenMint),
      userYesTokenAccount,
      userNoTokenAccount,
      tokenProgram: TOKEN_PROGRAM_ID,
    },
    signers: [payer],
  });
};