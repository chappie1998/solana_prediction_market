import { PublicKey, Transaction } from '@solana/web3.js';
import { Program, BN, AnchorProvider } from '@coral-xyz/anchor';
import { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction } from '@solana/spl-token';
import { PREDICTION_MARKET_PROGRAM_ID, PredictionMarket } from '@prediction-market/anchor';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { findProgramAddress } from './utils';

export const declareResult = async (
  program: Program<PredictionMarket>,
  oracle: WalletContextState,
  predictionMarketPubkey: PublicKey,
  poolPubkey: PublicKey,
  winner: number
): Promise<void> => {
  if (!oracle.publicKey) {
    throw new Error("Wallet not connected");
  }

  // const pool = await program.account.pool.fetch(poolPubkey);
  const pool = await program.account.pool.fetch(poolPubkey);

  await program.methods.declareResult(winner)
    .accounts({
      predictionMarket: predictionMarketPubkey,
      pool: poolPubkey,
      oracle: oracle.publicKey?.toString(),
      yesTokenMint: new PublicKey(pool.yesTokenMint),
      noTokenMint: new PublicKey(pool.noTokenMint),
    }) // The wallet adapter will handle signing
    .rpc();
};
