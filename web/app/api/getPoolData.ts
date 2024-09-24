import { PublicKey } from '@solana/web3.js';
import { Program } from '@coral-xyz/anchor';
import {  PredictionMarket } from '@prediction-market/anchor';
import { Pool } from './types';

export const getPoolData = async (
  program: Program<PredictionMarket>,
  poolPubkey: PublicKey
): Promise<Pool['account']> => {
  const poolData = await program.account.pool.fetch(poolPubkey);
  return poolData as Pool['account'];
};