"use client";
import Logo from '../logo/logo';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const { connected, publicKey } = useWallet();
  const [userAddress, setUserAddress] = useState<string | null>(null);

  const router = useRouter();
  useEffect(() => {
    if (connected && publicKey) {
      const address = publicKey.toBase58();
      setUserAddress(address);
      localStorage.setItem("publickey", address);

      // Check if the user exists in the database
      const checkUser = async () => {
        const response = await fetch(`/api/users/check?publicKey=${address}`);
        const data = await response.json();
        
        // If the user does not exist, show the onboarding form
        if (!data.exists) {
          router.push("/onboardingform");
        }
      };

      checkUser();
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
  );
};

export default Navbar;
