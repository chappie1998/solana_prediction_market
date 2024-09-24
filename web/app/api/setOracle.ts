import { PublicKey } from '@solana/web3.js';
import { Program  } from '@coral-xyz/anchor';
import {  PredictionMarket } from '@prediction-market/anchor';
import { WalletContextState } from '@solana/wallet-adapter-react';


export const setOracle = async (
  program: Program<PredictionMarket>,
  owner: WalletContextState,
  predictionMarketPubkey: PublicKey,
  newOracle: PublicKey
): Promise<void> => {

  await program.methods.setOracle(newOracle)
  .accounts({
    predictionMarket: predictionMarketPubkey,
    owner: owner.publicKey?.toString(),
  }) // The wallet adapter will handle signing
  .rpc();

};