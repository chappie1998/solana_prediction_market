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

// // Key for storing the prediction market public key in local storage
// const PREDICTION_MARKET_KEY = 'BX6RJHGbi7msj7t1ECCX6T1ZvvetHDK6UkjzAhPfWngq';

// /**
//  * Save the prediction market public key to local storage
//  * @param publicKey The public key of the prediction market
//  */
// export const savePredictionMarketPublicKey = (publicKey: PublicKey): void => {
//   localStorage.setItem(PREDICTION_MARKET_KEY, publicKey.toString());
// };

// /**
//  * Retrieve the prediction market public key from local storage
//  * @returns The public key of the prediction market, or null if not found
//  */
// export const getPredictionMarketPublicKey = (): PublicKey | null => {
//   const storedKey = localStorage.getItem(PREDICTION_MARKET_KEY);
//   return storedKey ? new PublicKey(storedKey) : null;
// };

// /**
//  * Clear the stored prediction market public key from local storage
//  */
// export const clearPredictionMarketPublicKey = (): void => {
//   localStorage.removeItem(PREDICTION_MARKET_KEY);
// };