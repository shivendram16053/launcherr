"use client";

import { useEffect } from 'react';
import { WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import React, { useState } from 'react';

const Page = () => {
    const { connected, disconnect } = useWallet();
    const [userAddress, setUserAddress] = useState('');

    useEffect(() => {
        if (connected) {
            // Get the wallet's public key
            const walletAddress = window.solana.publicKey.toString();
            setUserAddress(walletAddress);
        }
    }, [connected]);

    return (
        <div className='flex items-center justify-center h-screen'>
            <h1 className='text-xl font-medium'>Launcherr</h1>
            <div className='bg-white mt-2 rounded-md flex items-center justify-center shadow-inner shadow-black/70'>
                {!connected ? (
                    <WalletMultiButton />
                ) : (
                    <div className='flex flex-col items-center'>
                        <p className='mb-2'>Connected Address: {userAddress}</p>
                        <WalletDisconnectButton />
                    </div>
                )}
            </div>
        </div>
    );
}

export default Page;
