"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  params: Promise<{ classroomId: number }>;
}

export default function ClassroomSettingsPage({ params }: Props) {
  const router = useRouter();
  const [classroomId, setClassroomId] = useState<number | null>(null);

  useEffect(() => {
    params.then(({ classroomId }) => {
      setClassroomId(classroomId);
    });
  }, [params]);

  if (classroomId === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Classroom Settings</h1>
    </div>
  );
}