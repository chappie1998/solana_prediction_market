import { Keypair, PublicKey } from '@solana/web3.js';
import { Program} from '@coral-xyz/anchor';
import {  PredictionMarket } from '@prediction-market/anchor';

export const declareResult = async (
  program: Program<PredictionMarket>,
  oracle: Keypair,
  predictionMarketPubkey: PublicKey,
  poolPubkey: PublicKey,
  winner: number
): Promise<void> => {
  const pool = await program.account.pool.fetch(poolPubkey);

  await program.methods.declareResult(winner)
    .accounts({
      predictionMarket: predictionMarketPubkey,
      pool: poolPubkey,
      oracle: oracle.publicKey,
      yesTokenMint: new PublicKey(pool.yesTokenMint),
      noTokenMint: new PublicKey(pool.noTokenMint),
    }) 
    .signers([oracle])// The wallet adapter will handle signing
    .rpc();
};
