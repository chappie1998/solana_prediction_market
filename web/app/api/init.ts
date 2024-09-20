import { Keypair, PublicKey, SystemProgram } from '@solana/web3.js';
import { Program } from '@coral-xyz/anchor';
import { PredictionMarket } from './types';

export const initialize = async (
  program: Program,
  payer: Keypair,
  usdtMint: PublicKey,
  oracle: PublicKey
): Promise<PublicKey> => {
  const predictionMarket = Keypair.generate();

  await program.rpc.initialize(usdtMint, oracle, {
    accounts: {
      predictionMarket: predictionMarket.publicKey,
      owner: payer.publicKey,
      systemProgram: SystemProgram.programId,
    },
    signers: [payer, predictionMarket],
  });

  return predictionMarket.publicKey;
};
