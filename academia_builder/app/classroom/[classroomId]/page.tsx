"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useListClassroomsQuery } from "@/redux/features/classroomApiSlice";

interface ClassroomPageProps {
  params: Promise<{ classroomId: string }>;
}

export default function ClassroomPage({ params }: ClassroomPageProps) {
  const router = useRouter();
  const accountType = useSelector((state: RootState) => state.auth.accountType);
  const [classroomId, setClassroomId] = useState<number | null>(null);

  // Unwrap the params Promise
  useEffect(() => {
    params.then((resolvedParams) => {
      const classroomId = parseInt(resolvedParams.classroomId, 10);
      console.log("Classroom ID from URL:", classroomId);
      setClassroomId(classroomId);
    });
  }, [params]);

  // If the parse fails, handle it:
  if (classroomId !== null && Number.isNaN(classroomId)) {
    return <div>Invalid classroom ID</div>;
  }

  // We'll query only "id" fields to see which classroom IDs the user has
  const fields = ["id"];
  const { data, isLoading, error } = useListClassroomsQuery({ fields });

  // Wait until data is loaded to decide
  useEffect(() => {
    if (!isLoading && data && classroomId !== null) {
      // Check if user has a matching classroom
      const isValid = data.some((c: { id: number }) => c.id === classroomId);
      if (!isValid) {
        router.push("/unauthorized");
      }
    }
  }, [classroomId, data, isLoading, router]);

  if (classroomId === null || isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    // If you get a 401, handle it or redirect
    console.error("Error fetching classrooms:", error);
    return <div>Failed to load data. Maybe not authorized?</div>;
  }

  // We have the data, so let's check again or proceed
  const isClassroomValid = data?.some(
    (c: { id: number }) => c.id === classroomId
  );
  if (!isClassroomValid) {
    return <div>Loading...</div>; // or a spinner while the useEffect pushes to /unauthorized
  }

  // If we reach here, the user has access
  const handleSettingsClick = () => {
    router.push(`/classroom/${classroomId}/settings`);
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Classroom #{classroomId}</h1>
      {accountType === "teacher" && (
        <button
          onClick={handleSettingsClick}
          className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Settings
        </button>
      )}
      {/* The rest of your classroom page */}
    </div>
  );
}
