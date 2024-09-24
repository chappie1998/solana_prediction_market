import { Keypair, PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from '@solana/web3.js';
// import { Program, BN } from '@project-serum/anchor';
import { Program, BN } from '@coral-xyz/anchor';
import { findProgramAddress } from './utils';
import {  PredictionMarket } from '@prediction-market/anchor';
import { WalletContextState } from '@solana/wallet-adapter-react';

export const createPool = async (
  program: Program<PredictionMarket>,
  payer: WalletContextState,
  predictionMarketPubkey: PublicKey,
  startTime: number,
  endTime: number
): Promise<PublicKey> => {
  const [poolPubkey] = await findProgramAddress(
    [Buffer.from('pool')],
    program.programId
  );


  const [yesTokenMint] = await findProgramAddress(
    [Buffer.from('yes_token'), poolPubkey.toBuffer()],
    program.programId
  );

  const [noTokenMint] = await findProgramAddress(
    [Buffer.from('no_token'), poolPubkey.toBuffer()],
    program.programId
  );


  await program.methods.createPool( new BN(startTime),new BN(endTime))
    .accounts({
      predictionMarket: predictionMarketPubkey,
      owner: payer.publicKey?.toString(),
  })
  .rpc();

  return poolPubkey;
};