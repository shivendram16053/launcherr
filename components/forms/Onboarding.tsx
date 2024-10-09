"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, User, AtSign, Twitter, Shield } from 'lucide-react';
import { Textarea } from "../ui/textarea";

const steps = ['Welcome', 'Personal Info', 'Social', 'Verify'];

export default function OnboardingForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    twitter: '',
    ageVerified: false,
    publicKey: '',
    bio: '',
  });
  const [errors, setErrors] = useState({
    name: false,
    username: false,
    email: false,
    ageVerified: false,
    twitter: false,
    bio: false,
  });


  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if(userId){
      router.push("/dashboard");
    }
    
    const publicKey = localStorage.getItem("publickey");
    setFormData(prev => ({ ...prev, publicKey: publicKey || '' }));
  }, []);

  const validateStep = () => {
    let isValid = true;
    const newErrors = { name: false, username: false, email: false, ageVerified: false, twitter: false, bio: false };

    if (currentStep === 1) {
      if (!formData.name) {
        newErrors.name = true;
        isValid = false;
      }
      if (!formData.username) {
        newErrors.username = true;
        isValid = false;
      }
    }

    if (currentStep === 2) {
      if (!formData.email) {
        newErrors.email = true;
        isValid = false;
      }
      if (!formData.twitter) {
        newErrors.twitter = true;
        isValid = false;
      }
    }

    if (currentStep === 3) {
      if (!formData.ageVerified) {
        newErrors.ageVerified = true;
        isValid = false;
      }
      if (!formData.bio) {
        newErrors.bio = true;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement | HTMLTextAreaElement;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleNext = () => {
    if (validateStep() && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const response = await fetch("/api/users/onboard", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("userId", data.userId);
      router.push("/dashboard");
    } else {
      console.error("Onboarding failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black">
      <Card className="w-full max-w-md overflow-hidden bg-black border-none text-zinc-100 ">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create Your Profile</CardTitle>
          <CardDescription className="text-zinc-400">Step {currentStep + 1} of {steps.length}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative pt-1 mb-6">
            <div className="overflow-hidden h-1.5 text-xs flex rounded bg-zinc-800">
              <motion.div
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-white rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.5 }}
                style={{
                  boxShadow: '0 0 10px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.3)'
                }}
              />
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                {currentStep === 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Get Ready to Launch!</h3>
                    <p className="text-sm text-zinc-400">Just a few steps left to unlock <span className="font-medium text-white">Founder Mode.</span> Set up your account and start your journey!.</p>
                    <Button size="sm" type="button" onClick={handleNext} className=" bg-zinc-100 text-zinc-900 w-full hover:bg-zinc-200 font-semibold">
                      Get Started <ChevronRight className="font-semibold ml-0.5 h-4 w-4" />
                    </Button>

                  </div>
                )}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-zinc-100">Name</Label>
                      <div className="relative">
                        <User className="absolute left-2 top-2.5 h-4 w-4 text-zinc-400" />
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="pl-8 bg-stone-900 text-zinc-100 border-stone-800 focus:border-zinc-500"
                          placeholder="Your full name"
                          required
                        />
                        {errors.name && <p className="text-red-500 text-sm">Name is required</p>}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-zinc-100">Username</Label>
                      <div className="relative">
                        <AtSign className="absolute left-2 top-2.5 h-4 w-4 text-zinc-400" />
                        <Input
                          id="username"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          className="pl-8 bg-stone-900 text-zinc-100 border-stone-800 focus:border-zinc-500"
                          placeholder="Choose a username"
                          required
                        />
                        {errors.username && <p className="text-red-500 text-sm">Username is required</p>}
                      </div>
                    </div>
                  </div>
                )}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-zinc-100">Email</Label>
                      <div className="relative">
                        <AtSign className="absolute left-2 top-2.5 h-4 w-4 text-zinc-400" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="pl-8 bg-stone-900 text-zinc-100 border-stone-800 focus:border-zinc-500"
                          placeholder="your@email.com"
                          required
                        />
                        {errors.email && <p className="text-red-500 text-sm">Email is required</p>}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="twitter" className="text-zinc-100">Twitter Handle</Label>
                      <div className="relative">
                        <Twitter className="absolute left-2 top-2.5 h-4 w-4 text-zinc-400" />
                        <Input
                          id="twitter"
                          name="twitter"
                          value={formData.twitter}
                          onChange={handleInputChange}
                          className="pl-8 bg-stone-900 text-zinc-100 border-stone-800 focus:border-zinc-500"
                          placeholder="@yourtwitterhandle"
                        />
                        {errors.twitter && <p className="text-red-500 text-sm">Twitter handle is required</p>}
                      </div>
                    </div>
                  </div>
                )}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-zinc-100">Bio</Label>
                      <div className="relative">
                        <Textarea
                          id="bio"
                          name="bio"
                          value={formData.bio}  // Bio state linked here
                          onChange={handleInputChange}
                          className="bg-stone-900 text-zinc-100 border-stone-800 focus:border-zinc-500"
                          placeholder="Your bio here"
                          required
                        />
                        {errors.bio && <p className="text-red-500 text-sm">Bio is required</p>}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="ageVerified"
                        name="ageVerified"
                        checked={formData.ageVerified}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, ageVerified: checked as boolean }))}
                        className="border-zinc-600 data-[state=checked]:bg-zinc-400 data-[state=checked]:text-zinc-900"

                      />
                      <Label htmlFor="ageVerified" className="text-zinc-300">I confirm that I am 18 years or older</Label>
                    </div>
                    <div className="pt-4">
                      <Button size="sm" type="submit" className="w-full bg-zinc-100 text-zinc-900 hover:bg-zinc-200" disabled={
                        formData.ageVerified !== true
                      }>
                        Complete Registration <Shield className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
            {currentStep > 0 && currentStep < steps.length - 1 && (
              <div className="flex justify-between mt-6">
                <Button
                  size="sm"
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="bg-stone-900  text-zinc-100 border-stone-800 hover:bg-stone-800 hover:text-zinc-100"
                >
                  Back
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleNext}
                  className="bg-zinc-100 font-semibold text-zinc-900 hover:bg-zinc-200"
                >
                  Next <ChevronRight className="ml-0.5 font-semibold h-4 w-4" />
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}