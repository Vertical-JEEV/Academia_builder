"use client";

import { useResetPassword } from "@/hooks";
import { Form } from "@/components/forms";

export default function PasswordResetForm() {
  const { email, isLoading, onChange, onSubmit } = useResetPassword();

  const config = [
    {
      labelId: "email",
      type: "email",
      value: email,
      required: true,
      autoComplete: "email",
      placeholder: "Email",
    },
  ];

  return (
    <Form
      config={config}
      isLoading={isLoading}
      btnText="Send Reset Email"
      onChange={onChange}
      onSubmit={onSubmit}
    />
  );
}
