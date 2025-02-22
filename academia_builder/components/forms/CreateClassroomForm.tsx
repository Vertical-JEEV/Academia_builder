"use client";

import { Form } from "@/components/forms";
import { useCreateClassroom } from "@/hooks";
import { useListCoursesQuery } from "@/redux/features/coursesApiSlice";

export default function CreateClassroomForm() {
  const { name, course, isLoading, onChange, onSubmit } = useCreateClassroom();
  const { data: courses } = useListCoursesQuery();

  const courseOptions = courses?.map((course) => ({
    value: course,
    label: course,
  }));

  const config = [
    {
      labelId: "name",
      type: "text",
      value: name,
      required: true,
      placeholder: "Classroom Name",
    },
    {
      labelId: "course",
      type: "select",
      options: courseOptions,
      value: course,
      required: true,
      placeholder: "Select course",
    },
  ];
  return (
    <Form
      config={config}
      isLoading={isLoading}
      btnText="Create Classroom"
      onChange={onChange}
      onSubmit={onSubmit}
    />
  );
}
