"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { TrendingUp } from "lucide-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import OnboardingForm from "../forms/Onboarding"; // Import your OnboardingForm
import { useRouter } from "next/navigation";

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
          router.push("/onboardingform")
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
          <WalletMultiButton className="rounded-full mt-3 shadow-inner font-medium flex items-center gap-[2px]">
            Get Started <TrendingUp className="h-5 text-black/70" />
          </WalletMultiButton>
        ) : (
          <Link href={"/dashboard"}>
            <Button className="rounded-full mt-3 shadow-inner font-medium flex items-center gap-[2px]">
              Go to Dashboard
            </Button>
          </Link>
        )}
      </div>

      <div className="mt-14 border bg-stone-900 h-[800px] rounded-lg"></div>
    </main>
  );
};

export default Hero;
