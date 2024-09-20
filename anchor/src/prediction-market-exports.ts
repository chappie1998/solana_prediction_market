// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { Cluster, PublicKey } from '@solana/web3.js';
import PredictionMarketIDL from '../target/idl/prediction_market.json';
import type { PredictionMarket } from '../target/types/prediction_market';

// Re-export the generated IDL and type
export { PredictionMarket, PredictionMarketIDL };

// The programId is imported from the program IDL.
export const PREDICTION_MARKET_PROGRAM_ID = new PublicKey(
  PredictionMarketIDL.address
);

// This is a helper function to get the PredictionMarket Anchor program.
export function getPredictionMarketProgram(provider: AnchorProvider) {
  return new Program(PredictionMarketIDL as PredictionMarket, provider);
}

// This is a helper function to get the program ID for the PredictionMarket program depending on the cluster.
export function getPredictionMarketProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
    case 'mainnet-beta':
    default:
      return PREDICTION_MARKET_PROGRAM_ID;
  }
}
