import Link from "next/link";
import type { Metadata } from "next";
import { LoginForm } from "@/components/forms";
// import { SocialButtons } from "@/components/common";

export const metadata: Metadata = {
  title: "Academia Builder | Login",
  description: "Academia Builder login page",
};

export default function Login() {
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
            Log into your account
          </h2>
        </div>

        <div
          className="mt-6 sm:mx-auto
          sm:w-full sm:max-w-sm"
        >
          <LoginForm />
          {/* <SocialButtons /> */}
        </div>
        <p className="mt-6 text-center text-sm text-gray-500">
          Not a member?{" "}
          <Link
            href="/auth/register"
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Sign up now
          </Link>
        </p>
      </div>
    </>
  );
}
