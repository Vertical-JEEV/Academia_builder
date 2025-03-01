"use client";

import { useEffect, useState } from "react";
import { useListClassroomsQuery } from "@/redux/features/classroomApiSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import useJoinStudent from "@/hooks/use-join-student";

export default function DashboardPage() {
  const { data: classrooms, isLoading, error, refetch } = useListClassroomsQuery();
  const accountType = useSelector((state: RootState) => state.auth.accountType);
  const router = useRouter();
  const { isLoading: isJoining, onSubmit } = useJoinStudent();
  const [uniqueCode, setUniqueCode] = useState("");

  useEffect(() => {
    refetch();
  }, [router]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading classrooms</div>;

  const handleTileClick = (classroomId: string) => {
    router.push(`/classroom/${classroomId}`);
  };

  const handleCreateClassroom = () => {
    router.push("/create-classroom");
  };

  const handleUniqueCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUniqueCode(e.target.value);
  };

  const handleUniqueCodeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(uniqueCode, refetch);
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
      {accountType === "student" && (
        <form onSubmit={handleUniqueCodeSubmit} className="mb-6">
          <label className="block text-lg font-medium mb-2" htmlFor="uniqueCode">
            Enter Unique Code
          </label>
          <input
            type="text"
            id="uniqueCode"
            value={uniqueCode}
            onChange={handleUniqueCodeChange}
            className="mb-4 px-4 py-2 border rounded-lg w-full"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            disabled={isJoining}
          >
            Submit
          </button>
        </form>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.isArray(classrooms) && classrooms.map((classroom) => (
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