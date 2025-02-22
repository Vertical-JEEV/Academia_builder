"use client";

import { useListClassroomsQuery } from "@/redux/features/classroomApiSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { data: classrooms, isLoading, error } = useListClassroomsQuery();
  const accountType = useSelector((state: RootState) => state.auth.accountType);
  const router = useRouter();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading classrooms</div>;

  const handleTileClick = (classroomId: string) => {
    router.push(`/classroom/${classroomId}`);
  };

  const handleCreateClassroom = () => {
    router.push("/create-classroom");
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      {accountType === "teacher" && (
        <button
          onClick={handleCreateClassroom}
          className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Classroom
        </button>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {classrooms.map((classroom) => (
          <div
            key={classroom.id}
            className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleTileClick(classroom.id)}
          >
            <h2 className="text-xl font-semibold mb-2">{classroom.name}</h2>
            <p className="text-gray-600">{classroom.course}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
