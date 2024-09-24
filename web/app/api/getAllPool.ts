import { PublicKey } from '@solana/web3.js';
import { Program } from '@coral-xyz/anchor';
import { PredictionMarket } from '@prediction-market/anchor';
import { Pool } from './types';

export const getAllPools = async (program: Program<PredictionMarket>): Promise<Pool[]> => {
  const pools = await program.account.pool.all();
  return pools.map((pool: { publicKey: any; account: { startTime: number; endTime: number; poolAmount: number; status: { active: {}; } | { paused: {}; } | { ended: {}; }; winner: number; yesTokenMint: PublicKey; noTokenMint: PublicKey; bump: number; totalWinningTokens: number; }; }) => ({
    pubkey: pool.publicKey,
    account: pool.account as Pool['account']
  }));
};