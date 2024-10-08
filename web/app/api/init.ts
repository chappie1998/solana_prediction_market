import { Keypair, PublicKey, SystemProgram } from '@solana/web3.js';
import { Program } from '@coral-xyz/anchor';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { PredictionMarket } from '@prediction-market/anchor';
// import { savePredictionMarketPublicKey } from './utils';

export const initialize = async (
  program: Program<PredictionMarket>,
  payer: WalletContextState,
  usdtMint: PublicKey,
  oracle: PublicKey
): Promise<string> => {
  if (!payer.publicKey) {
    throw new Error('Wallet not connected');
  }
  const predictionMarket = Keypair.generate();

  await program.methods
    .initialize(usdtMint, oracle)
    .accounts({
      predictionMarket: predictionMarket.publicKey,
      owner: payer.publicKey?.toString(),
      systemProgram: SystemProgram.programId,
    })
    .signers([predictionMarket])
    .rpc();

  // Save the public key using the utility function
  // savePredictionMarketPublicKey(predictionMarket.publicKey);
  console.log('poolPubkey :', predictionMarket.publicKey.toBase58());
  return predictionMarket.publicKey.toBase58();
};
