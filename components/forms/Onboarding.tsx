"use client";

import React from "react";
import { useRouter } from "next/navigation"; // Import useRouter

interface OnboardingFormProps {
  publicKey: string; // Define the type for publicKey
}

const OnboardingForm: React.FC<OnboardingFormProps> = ({ publicKey }) => {
  const router = useRouter(); // Initialize router

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget); // Use event.currentTarget to get the form
    const data = Object.fromEntries(formData.entries());
    data.publicKey = publicKey; // Include the public key

    const response = await fetch("/api/users/onboard", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      // Handle successful onboarding, e.g., redirect to dashboard
      redirectToDashboard();
    } else {
      // Handle error
      console.error("Onboarding failed");
    }
  };

  const redirectToDashboard = () => {
    router.push("/dashboard"); // Redirect to the dashboard route after onboarding
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <input
        name="name"
        required
        placeholder="Name"
        className="p-2 border border-gray-300 rounded"
      />
      <input
        name="username"
        required
        placeholder="Username"
        className="p-2 border border-gray-300 rounded"
      />
      <input
        name="email"
        required
        type="email"
        placeholder="Email"
        className="p-2 border border-gray-300 rounded"
      />
      <input
        name="bio"
        placeholder="Short Bio"
        className="p-2 border border-gray-300 rounded"
      />
      <input
        name="twitter"
        placeholder="Twitter Handle"
        className="p-2 border border-gray-300 rounded"
      />
      <label className="flex items-center">
        <input type="checkbox" name="ageVerified" className="mr-2" />
        Age Verified
      </label>
      <button type="submit" className="p-2 bg-blue-500 text-white rounded">
        Submit
      </button>
    </form>
  );
};

export default OnboardingForm;
