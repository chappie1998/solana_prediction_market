import { Keypair, PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from '@solana/web3.js';
// import { Program, BN } from '@project-serum/anchor';
import * as anchor from '@coral-xyz/anchor';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { findProgramAddress } from './utils';

export const createPool = async (
  program: anchor.Program,
  payer: Keypair,
  predictionMarketPubkey: PublicKey,
  poolId: Buffer,
  startTime: number,
  endTime: number
): Promise<PublicKey> => {
  const [poolPubkey] = await findProgramAddress(
    [Buffer.from('pool'), poolId],
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

  await program.rpc.createPool(poolId, new anchor.BN(startTime), new anchor.BN(endTime), {
    accounts: {
      predictionMarket: predictionMarketPubkey,
      pool: poolPubkey,
      owner: payer.publicKey,
      yesTokenMint,
      noTokenMint,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
      rent: SYSVAR_RENT_PUBKEY,
    },
    signers: [payer],
  });

  return poolPubkey;
};