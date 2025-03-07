import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useCreateClassroomMutation } from "@/redux/features/classroomApiSlice";
import { toast } from "react-toastify";

export default function useCreateClassroom() {
  const router = useRouter();
  const [createClassroom, { isLoading }] = useCreateClassroomMutation();
  const [formData, setFormData] = useState({
    name: "",
    course: "",
  });

  const { name, course} = formData;

  const onChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = {
      name, // Change 'classroom_name' to 'name'
      course, // Change 'course_name' to 'course'
    };
    console.log("Request payload:", payload); // Log the request payload
    createClassroom(payload)
      .unwrap()
      .then((data) => {
        toast.success("Your classroom has been created");
        router.push("/dashboard");
      })
      .catch((error) => {
        toast.error("Failed to create classroom");
      });
  };

  return {
    name,
    course,
    isLoading,
    onChange,
    onSubmit,
  };
}
