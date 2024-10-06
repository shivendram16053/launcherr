"use client";
import Logo from '../logo/logo'
import { Button } from '../ui/button'

import { useEffect } from 'react';
import { WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { useState } from 'react';

const Navbar = () => {
  const { connected } = useWallet();
  const [userAddress, setUserAddress] = useState('');

  useEffect(() => {
    if (connected) {
      // Get the wallet's public key
      const walletAddress = window.solana.publicKey?.toString();
      setUserAddress(walletAddress);
    }
  }, [connected]);

  return (
    <div className='max-w-4xl lg:max-w-7xl mx-auto p-6 flex items-center justify-between'>
      <div>
        <Logo className='w-8 h-8' />
      </div>
      <nav>
        <Button className='rounded-full shadow-inner  font-medium'>Connect Wallet</Button>
      </nav>
    </div>
  )
}

export default Navbar