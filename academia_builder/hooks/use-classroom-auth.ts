"use client"; // because we use React hooks & next/navigation

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useListClassroomsQuery } from "@/redux/features/classroomApiSlice";

/**
 * Wraps logic for:
 *   1) Unwrapping the `params` promise to get `classroomId`.
 *   2) Fetching the user's list of classroom IDs via RTK Query.
 *   3) Redirecting to /unauthorized if the user doesn't have access.
 */
export function useClassroomAuth(params: Promise<{ classroomId: string }>) {
  const router = useRouter();

  // The final numeric ID, or null if not yet determined.
  const [classroomId, setClassroomId] = useState<number | null>(null);

  // Step 1: Unwrap the Promise to get the param & parse it
  useEffect(() => {
    params.then(({ classroomId }) => {
      const parsedId = parseInt(classroomId, 10);
      console.log("Classroom ID from URL:", parsedId);
      setClassroomId(parsedId);
    });
  }, [params]);

  // Step 2: Use RTK Query to fetch the user's available classroom IDs
  const fields = ["id"];
  const { data, isLoading, error } = useListClassroomsQuery({ fields });

  // Step 3: Once we have the data and a valid classroom ID, verify
  useEffect(() => {
    if (!isLoading && data && classroomId !== null) {
      const isValid = Array.isArray(data) && data.some((c: { id: number }) => c.id === classroomId);
      if (!isValid) {
        router.push("/unauthorized");
      }
    }
  }, [classroomId, data, isLoading, router]);

  return {
    classroomId,
    isLoading,
    error,
    // a quick check if the user is valid (null = not determined yet)
    isClassroomValid: Array.isArray(data)
      ? data.some((c: { id: number }) => c.id === classroomId)
      : null,
  };
}
