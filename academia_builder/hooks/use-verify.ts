import { useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { setAuth, finishInitialLoad, setAccountType } from "@/redux/features/authSlice";
import { useVerifyMutation } from "@/redux/features/authApiSlice";

export default function useVerify() {
  const dispatch = useAppDispatch();
  const [verify] = useVerifyMutation();
  useEffect(() => {
    verify(undefined)
      .unwrap()
      .then((response) => {
        dispatch(setAuth());
        dispatch(setAccountType(response.account_type));
      })
      .catch(() => {
        dispatch(finishInitialLoad());
      })
      .finally(() => {
        dispatch(finishInitialLoad());
      });
  }, []);
}
