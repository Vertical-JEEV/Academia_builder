import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { setAuth } from "@/redux/features/authSlice";
import { useCompleteSignupMutation } from "@/redux/features/authApiSlice";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

export default function useSocialAuth(authenticate: any, provider: string) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const effectRan = useRef(false);
  const [completeSignup] = useCompleteSignupMutation();

  useEffect(() => {
    const state = searchParams.get("state");
    const code = searchParams.get("code");

    if (state && code && !effectRan.current) {
      authenticate({ provider, state, code })
        .unwrap()
        .then((response: any) => {
          if (response.is_new) {
            Cookies.set("signup_token", response.token, {secure: true, sameSite: "strict"});
            router.push("/auth/select-account");
            return
          } else {
            dispatch(setAuth());
            toast.success("Logged in");
            router.push("/dashboard");
          }
        })
        .catch(() => {
          toast.error("Failed to log in");
          router.push("/auth/login");
        });
    }

    return () => {
      effectRan.current = true;
    };
  }, [authenticate, provider]);

  const continueSignup = (accountType: "teacher" | "student") => {
    const token = Cookies.get('signup_token');
    if(!token) {
      toast.error("Failed to sign up. Please try again.");
      router.push("/auth/login");
      return;
    }

    completeSignup({ token, account_type: accountType })
      .unwrap()
      .then(() => {
        dispatch(setAuth());
        Cookies.remove("signup_token");
        toast.success("Signed up successfully");
        router.push("/dashboard");
      })
      .catch(() => {
        Cookies.remove("signup_token");
        toast.error("Failed to sign up. Please try again.");
        router.push("/auth/login");
      });
    };
    return {continueSignup};
}
