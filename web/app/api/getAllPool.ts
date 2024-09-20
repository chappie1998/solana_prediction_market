import { Program } from '@project-serum/anchor';
import { Pool } from './types';
import { PublicKey } from '@solana/web3.js';

export const getAllPools = async (program: Program): Promise<Pool[]> => {
  const pools = await program.account.pool.all();
  return pools.map((pool: { publicKey: any; account: { id: Buffer; startTime: number; endTime: number; poolAmount: number; status: { active: {}; } | { paused: {}; } | { ended: {}; }; winner: number; yesTokenMint: PublicKey; noTokenMint: PublicKey; bump: number; totalWinningTokens: number; }; }) => ({
    pubkey: pool.publicKey,
    account: pool.account as Pool['account']
  }));
};