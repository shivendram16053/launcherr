/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Logo from "../logo/logo";
import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";

const WalletMultiButton = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

const Navbar = () => {
  const { connected, publicKey } = useWallet();

  const router = useRouter();
  useEffect(() => {
    if (connected && publicKey) {
      const address = publicKey.toBase58();
      localStorage.setItem("publickey", address);

      // Check if the user exists in the database
      const checkUser = async () => {
        const response = await fetch(`/api/users/check?publicKey=${address}`);
        const data = await response.json();

        // If the user does not exist, show the onboarding form
        if (!data.exists) {
          router.push("/onboarding");
        }
      };
      checkUser();
    } else {
      localStorage.removeItem("publickey");
    }
  }, [connected, publicKey]);

  return (
    <div className="max-w-4xl lg:max-w-7xl mx-auto p-6 flex items-center justify-between">
      <div>
        <Logo className="w-8 h-8" />
      </div>
      <div className="flex gap-5 items-center">
        {connected && publicKey && (
          <Link
            href={"/createproduct"}
            className="h-9 md:h-10 px-4 py-3 w-fit rounded-full text-sm font-medium flex items-center gap-[2px] bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Create Product
          </Link>
        )}
        <nav className="flex items-center space-x-4">
          {!connected ? <WalletMultiButton /> : 
          
          <div>
            <ul>
              <li>Profile</li>
              <li>Products</li>
              <li>Disconnect</li>
            </ul>
          </div>}
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
