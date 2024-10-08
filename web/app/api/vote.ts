import { PublicKey } from '@solana/web3.js';
import { Program, BN } from '@coral-xyz/anchor';
import { getAssociatedTokenAddress } from '@solana/spl-token';
import { PREDICTION_MARKET_PROGRAM_ID, PredictionMarket } from '@prediction-market/anchor';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';


export const vote = async (
  program: Program<PredictionMarket>,
  payer: WalletContextState,
  poolPubkey: PublicKey,
  amount: number,
  voteYes: boolean
): Promise<void> => {
  if (!payer.publicKey) {
    throw new Error("Wallet not connected");
  }

  const pool = await program.account.pool.fetch(poolPubkey);
  const predictionmarket = await program.account.predictionMarket.fetch(PREDICTION_MARKET_PROGRAM_ID);
  const userUsdtAccount = await getAssociatedTokenAddress(
    new PublicKey(predictionmarket.usdtMint),
    payer.publicKey
  );

  const poolUsdtAccount = await getAssociatedTokenAddress(
    new PublicKey(predictionmarket.usdtMint),
    poolPubkey,
    true
  );

  const userYesTokenAccount = await getAssociatedTokenAddress(
    new PublicKey(pool.yesTokenMint),
    payer.publicKey
  );

  const userNoTokenAccount = await getAssociatedTokenAddress(
    new PublicKey(pool.noTokenMint),
    payer.publicKey
  );

  await program.methods.vote(new BN(amount), voteYes)
    .accounts({
      pool: poolPubkey,
      user: payer.publicKey?.toString(),
      userUsdtAccount,
      poolUsdtAccount,
      yesTokenMint: new PublicKey(pool.yesTokenMint),
      noTokenMint: new PublicKey(pool.noTokenMint),
      userYesTokenAccount,
      userNoTokenAccount,
      tokenProgram: TOKEN_PROGRAM_ID,
    }) // The wallet adapter will handle signing
    .rpc();
};