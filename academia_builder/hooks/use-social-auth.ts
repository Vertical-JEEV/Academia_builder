// import { useEffect, useRef } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useAppDispatch } from "@/redux/hooks";
// import { setAuth } from "@/redux/features/authSlice";
// import { toast } from "react-toastify";

// export default function useSocialAuth(authenticate: any, provider: string) {
//   const dispatch = useAppDispatch();
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const effectRan = useRef(false);

//   useEffect(() => {
//     const state = searchParams.get("state");
//     const code = searchParams.get("code");
//     const accountType = searchParams.get("account_type"); 

//     if (state && code && !effectRan.current) {
//       authenticate({ provider, state, code, account_type: accountType })
//         .unwrap()
//         .then((response: any) => {
//           // Redirect new users without account_type to select account type
//           console.log("Is the user new ?", response.user.is_new);
//           console.log("Account type", accountType);
//           if (response.user.is_new && !accountType) {
           
//             router.push(`/select-account-type?state=${state}&code=${code}`);
//           } else {
//             // Set the user's authentication state
//             dispatch(setAuth());
//             toast.success("Logged in");
//             router.push("/dashboard");
//           }
//         })
//         .catch(() => {
//           toast.error("Failed to log in");
//           router.push("/auth/login");
//         });
//     }

//     return () => {
//       effectRan.current = true;
//     };
//   }, [authenticate, provider]);
// }
