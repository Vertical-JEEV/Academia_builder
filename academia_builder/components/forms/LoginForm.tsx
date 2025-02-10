"use client";

import { useLogin } from "@/hooks";
import { Form } from "@/components/forms";

export default function LoginForm() {
  const { email, password, isLoading, onChange, onSubmit } = useLogin();

  const config = [
    {
      labelId: "email",
      type: "email",
      value: email,
      required: true,
      autoComplete: "email",
      placeholder: "Email",
    },
    {
      labelId: "password",
      type: "password",
      value: password,
      required: true,
      autoComplete: "current-password",
      placeholder: "Password",
    },
  ];

  return (
    <Form
      config={config}
      isLoading={isLoading}
      btnText="Login"
      onChange={onChange}
      onSubmit={onSubmit}
    >
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-500 text-indigo-600 focus:ring-indigo-500"
          />
          <label
            htmlFor="remember-me"
            className="ml-2 block text-sm font-semibold text-gray-900"
          >
            Remember me
          </label>
        </div>
        <div>
          <a
            href="/password-reset"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Forgot password?
          </a>
        </div>
      </div>
    </Form>
  );
}
