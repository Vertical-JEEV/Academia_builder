"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface Props {
  params: Promise<{ classroomId: number }>;
}

export default function ActivationPage({ params }: Props) {
  const router = useRouter();
  const [classroomId, setClassroomId] = React.useState<number | null>(null);

  React.useEffect(() => {
    params.then(({ classroomId }) => {
      setClassroomId(classroomId);
    });
  }, [params]);

  if (classroomId === null) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Classroom: {classroomId}</h1>
    </div>
  );
}


