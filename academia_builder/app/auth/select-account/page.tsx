"use client";

import React, { useState } from "react";
import useSocialAuth from "@/hooks/use-social-auth";
import { useSocialAuthenticateMutation } from "@/redux/features/authApiSlice";
import {toast } from "react-toastify";

export default function Page() {
  const [accountType, setAccountType] = useState<"student" | "teacher" | null>(
    null
  );
  const [googleAuthenticate] = useSocialAuthenticateMutation();
  const { continueSignup } = useSocialAuth(googleAuthenticate, "google-oauth2"); // Replace "google" with your provider

  const handleContinue = () => {
    if (accountType) {
      continueSignup(accountType);
    } else {
        toast.error("Please select an account type.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="mb-6 text-3xl font-bold text-center text-gray-800">
          Select Your Account Type
        </h1>
        <p className="mb-8 text-center text-gray-600">
          Please select the type of account you want to create.
        </p>
        <div className="flex justify-around mb-8">
          <button
            type="button"
            onClick={() => setAccountType("student")}
            className={`px-6 py-3 rounded-lg transition-colors ${
              accountType === "student"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => setAccountType("teacher")}
            className={`px-6 py-3 rounded-lg transition-colors ${
              accountType === "teacher"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Teacher
          </button>
        </div>
        <button
          type="button"
          onClick={handleContinue}
          disabled={!accountType}
          className={`w-full py-3 font-semibold rounded-lg transition-colors ${
            accountType
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-gray-400 text-gray-200 cursor-not-allowed"
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
