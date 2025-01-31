import { PasswordResetConfirmForm } from "@/components/forms";
import type { Metadata } from "next";



export const metadata: Metadata = {
  title: "Academia Builder | Password Reset Confirm",
  description: "Academia Builder password reset confirm page",
};

interface Props {
  params: Promise<{ uid: string; token: string }>;
}

export default async function PasswordResetConfirmPage({ params }: Props) {

  const {uid, token} = await params;
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Reset your password
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <PasswordResetConfirmForm uid={uid} token={token} />
      </div>
    </div>
  );
}
