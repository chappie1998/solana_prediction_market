import { Keypair, PublicKey } from '@solana/web3.js';
// import { Program } from '@project-serum/anchor';
import * as anchor from '@coral-xyz/anchor';
import { TOKEN_PROGRAM_ID, Token, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Program } from '@coral-xyz/anchor';

export const claim = async (
  program: Program,
  user: Keypair,
  poolPubkey: PublicKey
): Promise<void> => {
  const pool = await program.account.pool.fetch(poolPubkey);
  const userUsdtAccount = await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    new PublicKey(pool.usdtMint),
    user.publicKey
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
    user.publicKey
  );

  const userNoTokenAccount = await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    new PublicKey(pool.noTokenMint),
    user.publicKey
  );

  await program.rpc.claim({
    accounts: {
      pool: poolPubkey,
      user: user.publicKey,
      userUsdtAccount,
      poolUsdtAccount,
      yesTokenMint: new PublicKey(pool.yesTokenMint),
      noTokenMint: new PublicKey(pool.noTokenMint),
      userYesTokenAccount,
      userNoTokenAccount,
      tokenProgram: TOKEN_PROGRAM_ID,
    },
    signers: [user],
  });
};