import { PublicKey, Transaction } from '@solana/web3.js';
import { Program, BN, AnchorProvider } from '@coral-xyz/anchor';
import { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction } from '@solana/spl-token';
import { PREDICTION_MARKET_PROGRAM_ID, PredictionMarket } from '@prediction-market/anchor';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';

export const vote = async (
  program: Program<PredictionMarket>,
  payer: WalletContextState,
  poolPubkey: PublicKey,
  amount: number,
  voteYes: boolean
): Promise<void> => {
  if (!payer.publicKey) {
    throw new Error("Wallet not connected");
  }

  const pool = await program.account.pool.fetch(poolPubkey);
  const usdtMint = new PublicKey("EcifQ3Fs4CVDNTpWQBWta85ctNrHNGWncDtXcux5NULe");
  const userUsdtAccount = await getAssociatedTokenAddress(
    usdtMint,
    payer.publicKey
  );
  const poolUsdtAccount = await getAssociatedTokenAddress(
    usdtMint,
    poolPubkey,
    true
  );
  const userYesTokenAccount = await getAssociatedTokenAddress(
    new PublicKey(pool.yesTokenMint),
    payer.publicKey
  );
  const userNoTokenAccount = await getAssociatedTokenAddress(
    new PublicKey(pool.noTokenMint),
    payer.publicKey
  );

  // Check if accounts exist and create them if they don't
  const accountsToCheck = [
    { address: poolUsdtAccount, mint: usdtMint, owner: poolPubkey },
    { address: userYesTokenAccount, mint: new PublicKey(pool.yesTokenMint), owner: payer.publicKey },
    { address: userNoTokenAccount, mint: new PublicKey(pool.noTokenMint), owner: payer.publicKey }
  ];

  const createAccountInstructions = [];
  for (const account of accountsToCheck) {
    const accountInfo = await program.provider.connection.getAccountInfo(account.address);
    if (!accountInfo) {
      createAccountInstructions.push(
        createAssociatedTokenAccountInstruction(
          payer.publicKey,
          account.address,
          account.owner,
          account.mint
        )
      );
    }
  }

  if (createAccountInstructions.length > 0) {
    const tx = new Transaction().add(...createAccountInstructions);
    const anchorProvider = program.provider as AnchorProvider;
    if (!anchorProvider.sendAndConfirm) {
      throw new Error("Provider does not support sendAndConfirm");
    }
    const signature = await anchorProvider.sendAndConfirm(tx, []);
    console.log(`Created missing token accounts. Signature: ${signature}`);
  }

  // Now proceed with the vote
  await program.methods.vote(new BN(amount), voteYes)
    .accounts({
      pool: poolPubkey,
      user: payer.publicKey,
      userUsdtAccount,
      poolUsdtAccount,
      yesTokenMint: new PublicKey(pool.yesTokenMint),
      noTokenMint: new PublicKey(pool.noTokenMint),
      userYesTokenAccount,
      userNoTokenAccount,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .rpc();
};