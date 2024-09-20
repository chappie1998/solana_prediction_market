import { PublicKey } from '@solana/web3.js';
import { Program } from '@coral-xyz/anchor';
import { Pool } from './types';

export const getPoolData = async (
  program: Program,
  poolPubkey: PublicKey
): Promise<Pool['account']> => {
  const poolData = await program.account.pool.fetch(poolPubkey);
  return poolData as Pool['account'];
};