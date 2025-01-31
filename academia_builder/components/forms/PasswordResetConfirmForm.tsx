"use client";

import { useResetPasswordConfirm } from "@/hooks";
import { Form } from "@/components/forms";

interface Props {
  uid: string;
  token: string;
}

export default function PasswordResetConfirmForm({ uid, token }: Props) {
  const { new_password, re_new_password, isLoading, onChange, onSubmit } =
    useResetPasswordConfirm(uid, token);

  const config = [
    {
      labelId: "new_password",
      type: "password",
      value: new_password,
      required: true,
      autoComplete: "new-password",
      placeholder: "New Password",
    },
    {
      labelId: "re_new_password",
      type: "password",
      value: re_new_password,
      required: true,
      autoComplete: "new-password",
      placeholder: "Confirm New Password",
    },
  ];

  return (
    <Form
      config={config}
      isLoading={isLoading}
      btnText="Reset Password"
      onChange={onChange}
      onSubmit={onSubmit}
    />
  );
}
