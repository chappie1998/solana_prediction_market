import { Keypair, PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from '@solana/web3.js';
// import { Program, BN } from '@project-serum/anchor';
import { Program, BN } from '@coral-xyz/anchor';
import { bufferToU8Array32, findProgramAddress } from './utils';
import {  PredictionMarket } from '@prediction-market/anchor';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { WalletContextState } from '@solana/wallet-adapter-react';

export const createPool = async (
  program: Program<PredictionMarket>,
  payer: WalletContextState,
  predictionMarketPubkey: PublicKey,
  startTime: number,
  endTime: number
): Promise<PublicKey> => {

  // Generate a new pool ID
  const poolId = Buffer.from(Keypair.generate().publicKey.toBytes()).toJSON().data;

  const [poolPubkey] = await findProgramAddress(
    [Buffer.from('pool'), Buffer.from(poolId)],
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

  // const poolIdU8Array32 = bufferToU8Array32(poolId);
  
  await program.methods.createPool( poolId, new BN(startTime),new BN(endTime))
    .accounts({
      predictionMarket: predictionMarketPubkey,
      pool: poolPubkey,
      owner: payer.publicKey?.toString(),
      yesTokenMint,
      noTokenMint,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
      rent: SYSVAR_RENT_PUBKEY,
  })
  .rpc();

  return poolPubkey;
};

