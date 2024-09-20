import { Keypair, PublicKey } from '@solana/web3.js';
// import { Program } from '@project-serum/anchor';
import * as anchor from '@coral-xyz/anchor';

export const setOracle = async (
  program: anchor.Program,
  owner: Keypair,
  predictionMarketPubkey: PublicKey,
  newOracle: PublicKey
): Promise<void> => {
  await program.rpc.setOracle(newOracle, {
    accounts: {
      predictionMarket: predictionMarketPubkey,
      owner: owner.publicKey,
    },
    signers: [owner],
  });
};