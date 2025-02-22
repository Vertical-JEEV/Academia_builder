import { RequireAuth } from "@/components/utils";
interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <RequireAuth allowedAccountTypes={["student", "teacher"]}>
      {children}
    </RequireAuth>
  );
}
