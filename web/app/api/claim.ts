import {  PublicKey } from '@solana/web3.js';
import { Program } from '@coral-xyz/anchor';
import {  getAssociatedTokenAddress } from '@solana/spl-token';
import { PREDICTION_MARKET_PROGRAM_ID, PredictionMarket } from '@prediction-market/anchor';
import { WalletContextState } from '@solana/wallet-adapter-react';

export const claim = async (
  program: Program<PredictionMarket>,
  user: WalletContextState,
  poolPubkey: PublicKey
): Promise<void> => {
  if (!user.publicKey) {
    throw new Error("Wallet not connected");
  }

  const pool = await program.account.pool.fetch(poolPubkey);
  const predictionmarket = await program.account.predictionMarket.fetch(PREDICTION_MARKET_PROGRAM_ID);
  const userUsdtAccount = await getAssociatedTokenAddress(
    new PublicKey(predictionmarket.usdtMint),
    user.publicKey
  );

  const poolUsdtAccount = await getAssociatedTokenAddress(
    new PublicKey(predictionmarket.usdtMint),
    poolPubkey,
    true
  );

  const userYesTokenAccount = await getAssociatedTokenAddress(
    new PublicKey(pool.yesTokenMint),
    user.publicKey
  );

  const userNoTokenAccount = await getAssociatedTokenAddress(
    new PublicKey(pool.noTokenMint),
    user.publicKey
  );

  await program.methods.claim()
    .accounts({
      pool: poolPubkey,
      user: user.publicKey?.toString(),
      userUsdtAccount,
      poolUsdtAccount,
      yesTokenMint: new PublicKey(pool.yesTokenMint),
      noTokenMint: new PublicKey(pool.noTokenMint),
      userYesTokenAccount,
      userNoTokenAccount,
    }) // The wallet adapter will handle signing
    .rpc();
};