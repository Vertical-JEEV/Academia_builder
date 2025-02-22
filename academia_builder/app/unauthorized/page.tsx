import { MessagePage } from "@/components/common";

export default function Unauthorized() {
  return (
    <MessagePage
      title="Unauthorized"
      message="You are not authorized to view this page."
    />
  );
}