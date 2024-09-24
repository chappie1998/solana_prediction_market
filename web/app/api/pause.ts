import { PublicKey } from '@solana/web3.js';
import { Program, BN } from '@coral-xyz/anchor';
import { getAssociatedTokenAddress } from '@solana/spl-token';
import { PREDICTION_MARKET_PROGRAM_ID, PredictionMarket } from '@prediction-market/anchor';
import { WalletContextState } from '@solana/wallet-adapter-react';
export const pausePool = async (
  program: Program<PredictionMarket>,
  owner: WalletContextState,
  predictionMarketPubkey: PublicKey,
  poolPubkey: PublicKey
): Promise<void> => {

  await program.methods.pausePool()
  .accounts({
    predictionMarket: predictionMarketPubkey,
    pool: poolPubkey,
    owner: owner.publicKey?.toString(),
  }) // The wallet adapter will handle signing
  .rpc();

};