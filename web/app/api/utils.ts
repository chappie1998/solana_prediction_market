import { Connection, Keypair, PublicKey, Transaction } from '@solana/web3.js';
import { Program, Provider, web3 } from '@coral-xyz/anchor';
import { PROGRAM_ID } from './config';


export const findProgramAddress = async (
  seeds: (Buffer | Uint8Array)[],
  programId: PublicKey
): Promise<[PublicKey, number]> => {
  return await PublicKey.findProgramAddress(seeds, programId);
};