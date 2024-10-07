"use client";

import OnboardingForm from '@/components/forms/Onboarding';
import React, { useEffect, useState } from 'react';

const Page = () => {
  const [userAddress, setUserAddress] = useState<string>('');

  useEffect(() => {
    const publicKey = localStorage.getItem("publicKey");
    setUserAddress(publicKey || ''); 
  }, []);

  return (
    <div>
      <OnboardingForm publicKey={userAddress} />
    </div>
  );
};

export default Page;
