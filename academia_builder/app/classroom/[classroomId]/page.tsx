"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface Props {
  params: Promise<{ classroomId: number }>;
}

export default function ClassroomPage({ params }: Props) {
  const router = useRouter();
  const [classroomId, setClassroomId] = useState<number | null>(null);
  const accountType = useSelector((state: RootState) => state.auth.accountType);

  useEffect(() => {
    params.then(({ classroomId }) => {
      setClassroomId(classroomId);
    });
  }, [params]);

  if (classroomId === null) {
    return <div>Loading...</div>;
  }

  const handleSettingsClick = () => {
    router.push(`/classroom/${classroomId}/settings`);
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Classroom</h1>
      {accountType === "teacher" && (
        <button
          onClick={handleSettingsClick}
          className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Settings
        </button>
      )}
    </div>
  );
}

