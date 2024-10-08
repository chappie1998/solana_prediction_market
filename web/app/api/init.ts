import { Keypair, PublicKey, SystemProgram } from '@solana/web3.js';
import { Program } from '@coral-xyz/anchor';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { PredictionMarket } from '@prediction-market/anchor';

export const initialize = async (
  program: Program<PredictionMarket>,
  payer: WalletContextState,
  usdtMint: PublicKey,
  oracle: PublicKey
): Promise<PublicKey> => {
  const predictionMarket = Keypair.generate();

  await program.methods.initialize(usdtMint, oracle)
    .accounts({
      predictionMarket: predictionMarket.publicKey,
      owner: payer.publicKey?.toString(),
      systemProgram: SystemProgram.programId,
  })
  .signers([predictionMarket])
  .rpc();

  return predictionMarket.publicKey;
};
