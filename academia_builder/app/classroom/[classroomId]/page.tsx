"use client";
import { useClassroomAuth } from "@/hooks"; // or "@/hooks/useClassroomAuth"
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";

interface ClassroomPageProps {
  // The incoming param is still a Promise in your usage
  params: Promise<{ classroomId: string }>;
}

export default function ClassroomPage({ params }: ClassroomPageProps) {
  // 1) Call your hook to parse & verify the classroom ID
  const { classroomId, isLoading, error, isClassroomValid } =
    useClassroomAuth(params);

  // 2) If you need the user's accountType from Redux
  const accountType = useSelector((state: RootState) => state.auth.accountType);
  const router = useRouter();

  // funtion to redirect user to settings page when they click the settings button
  const handleSettings = () => {
    router.push(`/classroom/${classroomId}/settings`);
  };

  if (classroomId !== null && Number.isNaN(classroomId)) {
    return <div>Invalid classroom ID</div>;
  }

  if (isLoading) {
    return <div>Loading classrooms...</div>;
  }

  if (error) {
    console.error("Error fetching classroom IDs:", error);
    return <div>Failed to load data. Maybe not authorized?</div>;
  }

  // isClassroomValid might be false or null. If false, we already redirect.
  if (isClassroomValid === null) {
    return <div>Checking authorization...</div>;
  }

  // If we get here, user can access the classroom
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Classroom #{classroomId}</h1>
      {accountType === "teacher" && (
        <button
          onClick={handleSettings}
          className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Settings
        </button>
      )}
      {/* Your classroom content here */}
    </div>
  );
}
