'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { ExplorerLink } from '../cluster/cluster-ui';
import { WalletButton } from '../solana/solana-provider';
import { AppHero, ellipsify } from '../ui/ui-layout';
import { usePredictionMarketProgram } from './prediction-market-data-access';
import {
  PredictionMarketCreate,
  PredictionMarketProgram,
} from './prediction-market-ui';

export default function PredictionMarketFeature() {
  const { publicKey } = useWallet();
  const { programId } = usePredictionMarketProgram();

  return publicKey ? (
    <div>
      <AppHero
        title="PredictionMarket"
        subtitle={'Run the program by clicking the "Run program" button.'}
      >
        <p className="mb-6">
          <ExplorerLink
            path={`account/${programId}`}
            label={ellipsify(programId.toString())}
          />
        </p>
        <PredictionMarketCreate />
      </AppHero>
      <PredictionMarketProgram />
    </div>
  ) : (
    <div className="max-w-4xl mx-auto">
      <div className="hero py-[64px]">
        <div className="hero-content text-center">
          <WalletButton className="btn btn-primary" />
        </div>
      </div>
    </div>
  );
}
