import { useState, ChangeEvent, FormEvent } from "react";
import { useResetPasswordMutation } from "@/redux/features/authApiSlice";
import { toast } from "react-toastify";

export default function useResetPassword() {
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const [email, setEmail] = useState("");

  const onChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setEmail(event.target.value);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    resetPassword({ email })
      .unwrap()
      .then(() => {
        toast.success("Request sent, check your email for reset link");
      })
      .catch((error) => {
        toast.error("Failed to send request");
      });
  };

  return {
    email,
    isLoading,
    onChange,
    onSubmit,
  };
}
