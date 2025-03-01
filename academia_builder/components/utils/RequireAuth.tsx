"use client";

import { redirect } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { Spinner } from "@/components/common";


interface Props {
  children: React.ReactNode;
  allowedAccountTypes: string[];

}

export default function RequireAuth({ children, allowedAccountTypes }: Props) {
  const { isLoading, isAuthenticated, accountType } = useAppSelector(state => state.auth);
  // console.log("isLoading", isLoading);
  // console.log("isAuthenticated", isAuthenticated);
  

  if (isLoading) {
    return (
      
      <div className="flex justify-center my-8">
        <Spinner lg/>
      </div>
    );
  }
  if (!isAuthenticated || !accountType || !allowedAccountTypes.includes(accountType)) {
      redirect("/unauthorized");
  }

  

  return <>{children}</>;
}
