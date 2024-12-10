import React, { useEffect } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletProvider } from '@solana/wallet-adapter-react';
import { useMemo } from 'react';

const ConnectWallet = () => {
  const wallet = useWallet();

  useEffect(() => {
    if (wallet.connected) {
      console.log('Wallet connected:', wallet.publicKey?.toString());
    }
  }, [wallet.connected]);

  // Connect wallet button
  return (
    <div>
      {/* Render a button to connect/disconnect wallet */}
      <WalletMultiButton className="wallet-adapter-button-trigger">
        {wallet.connected ? 'Connected' : 'Connect Wallet'}
      </WalletMultiButton>
    </div>
  );
};

// Wrap the component in the WalletProvider
const App = () => {
  const network = WalletAdapterNetwork.Devnet;

  // Create a connection to the devnet cluster
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <WalletProvider wallets={wallets}>
      <ConnectWallet />
    </WalletProvider>
  );
};

export default App;
