import { PublicKey } from '@solana/web3.js';

export interface PredictionMarket {
  usdtMint: PublicKey;
  oracle: PublicKey;
  owner: PublicKey;
}

export interface Pool {
  pubkey: PublicKey;
  account: {
    id: Buffer;
    startTime: number;
    endTime: number;
    poolAmount: number;
    status: { active: {} } | { paused: {} } | { ended: {} };
    winner: number;
    yesTokenMint: PublicKey;
    noTokenMint: PublicKey;
    bump: number;
    totalWinningTokens: number;
  };
}