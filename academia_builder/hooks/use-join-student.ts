import { useJoinStudentMutation } from "@/redux/features/classroomApiSlice";
import { toast } from "react-toastify";

export default function useJoinStudent() {
  const [joinStudent, { isLoading }] = useJoinStudentMutation();

  const onSubmit = (unique_code: string, onSuccess: () => void) => {
    joinStudent({ unique_code })
      .unwrap()
      .then(() => {
        toast.success("Successfully joined classroom");
        onSuccess();
      })
      .catch((error) => {
        toast.error("Failed to join classroom");
      });
  };

  return {
    isLoading,
    onSubmit,
  };
}
