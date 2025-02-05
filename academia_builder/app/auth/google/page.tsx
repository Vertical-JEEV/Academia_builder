"use client";

import { useSocialAuthenticateMutation } from "@/redux/features/authApiSlice";
import { useSocialAuth } from "@/hooks";
import { Spinner } from "@/components/common";

export default function Page() {
  const [googleAuthenticate] = useSocialAuthenticateMutation();
  useSocialAuth(googleAuthenticate, "google-oauth2");
  // its a loading spinner but its on the left side of the screen

  return (
    <div className="flex justify-center my-8">
      <Spinner lg />
    </div>
  );
}
