import { Keypair, PublicKey } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';
export const pausePool = async (
  program: anchor.Program,
  owner: Keypair,
  predictionMarketPubkey: PublicKey,
  poolPubkey: PublicKey
): Promise<void> => {
  await program.rpc.pausePool({
    accounts: {
      predictionMarket: predictionMarketPubkey,
      pool: poolPubkey,
      owner: owner.publicKey,
    },
    signers: [owner],
  });
};