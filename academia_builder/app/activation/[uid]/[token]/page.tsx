"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useActivationMutation } from "@/redux/features/authApiSlice";
import { toast } from "react-toastify";

interface Props {
  params: Promise<{ uid: string; token: string }>;
}

export default function ActivationPage({ params }: Props) {
  const router = useRouter();
  const [activation] = useActivationMutation();
  useEffect(() => {
    params.then(({ uid, token }) => {
      // Call the activation endpoint with the uid and token
      activation({ uid, token })
        .unwrap()
        .then(() => {
          toast.success("Account activated");
        })
        .catch(() => {
          toast.error("Failed to activate account");
        })
        .finally(() => {
          router.push("/auth/login");
        });
    });
  }, []);

  // return a loading screen while the activation is in progress
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h1 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Activating your account...
        </h1>
      </div>
    </div>
  );
}
