"use client";
import Logo from '../logo/logo'
import { Button } from '../ui/button'
import { useEffect, useState } from 'react';
import { WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';

const Navbar = () => {
  const { connected, publicKey } = useWallet();
  const [userAddress, setUserAddress] = useState<string | null>(null);

  useEffect(() => {
    if (connected && publicKey) {
      // Get the wallet's public key
      setUserAddress(publicKey.toBase58());
      localStorage.setItem("publickey",publicKey.toBase58());
    } else {
      setUserAddress(null); // Reset address if disconnected
    }
  }, [connected, publicKey]);

  return (
    <div className='max-w-4xl lg:max-w-7xl mx-auto p-6 flex items-center justify-between'>
      <div>
        <Logo className='w-8 h-8' />
      </div>
      <nav className='flex items-center space-x-4'>
        <WalletMultiButton />
      </nav>
    </div>
  )
}

export default Navbar;
