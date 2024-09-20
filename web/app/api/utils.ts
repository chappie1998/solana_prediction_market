import { Connection, Keypair, PublicKey, Transaction } from '@solana/web3.js';
import { Program, Provider, web3 } from '@project-serum/anchor';
import { IDL } from './idl/prediction_market'; // You'll need to generate this IDL file
import { PROGRAM_ID } from './config';

export const createProvider = (connection: Connection, wallet: Keypair): Provider => {
  return new Provider(
    connection,
    {
      publicKey: wallet.publicKey,
      signTransaction: (tx: Transaction) => Promise.resolve(tx),
      signAllTransactions: (txs: Transaction[]) => Promise.resolve(txs),
    },
    { commitment: 'confirmed' }
  );
};

export const getProgram = (connection: Connection, wallet: Keypair): Program => {
  const provider = createProvider(connection, wallet);
  return new Program(IDL, PROGRAM_ID, provider);
};

export const findProgramAddress = async (
  seeds: (Buffer | Uint8Array)[],
  programId: PublicKey
): Promise<[PublicKey, number]> => {
  return await PublicKey.findProgramAddress(seeds, programId);
};