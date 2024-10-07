/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const WalletMultiButton = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
)

const Hero = () => {
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
          router.push("/onboarding")
        } 
      };

      checkUser();
    } else {
      setUserAddress(null);
    }
  }, [connected, publicKey]);

  return (
    <main className="max-w-4xl lg:max-w-7xl mx-auto p-6 mt-20">
      <div>
        <h1 className="text-3xl md:text-6xl font-semibold tracking-tight">
          Launch. Share. Grow.
        </h1>
        <p className="mt-2 text-sm md:text-base text-muted-foreground leading-tight">
          Seamlessly launch your project and share it through blink, and{" "}
          <br className="hidden md:block" /> let the community power its growth
          with upvotes, reviews, and tips.
        </p>
        {!userAddress && !connected ? (
          <WalletMultiButton style={{marginTop: "12px"}}>
            Get Started <TrendingUp className="h-5 text-black/70" />
          </WalletMultiButton>
        ) : (
          <Link href={"/dashboard"} className="h-9 md:h-10 px-4 py-3 w-fit rounded-full text-sm mt-3 font-medium flex items-center gap-[2px] bg-primary text-primary-foreground hover:bg-primary/90">
              Go to Dashboard
          </Link>
        )}
      </div>

      <div className="mt-14 border bg-stone-900 h-[800px] rounded-lg"></div>
    </main>
  );
};

export default Hero;
