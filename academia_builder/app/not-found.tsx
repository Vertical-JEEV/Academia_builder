import { MessagePage } from "@/components/common";

export default function NotFound() {
  return (
    <MessagePage
      title="This page doesn't exist"
      message="We searched high and low, but we couldn't find the page you're looking for."
    />
  );
}