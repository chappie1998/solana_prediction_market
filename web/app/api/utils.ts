import { Connection, Keypair, PublicKey, Transaction } from '@solana/web3.js';
import { Program, Provider, web3 } from '@coral-xyz/anchor';
import { PROGRAM_ID } from './config';


export const findProgramAddress = async (
  seeds: (Buffer | Uint8Array)[],
  programId: PublicKey
): Promise<[PublicKey, number]> => {
  return await PublicKey.findProgramAddress(seeds, programId);
};

export function bufferToU8Array32(buffer: Buffer): [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number] {
  if (buffer.length !== 32) {
    throw new Error('Buffer must be exactly 32 bytes long');
  }
  
  return Array.from(buffer) as [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number];
}