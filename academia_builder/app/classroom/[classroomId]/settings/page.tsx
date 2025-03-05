"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useClassroomAuth } from "@/hooks"; // <--- your new custom hook

/** Represents a Student in the classroom */
type Student = {
  id: number;
  name: string;
};

interface SettingsPageProps {
  params: Promise<{ classroomId: string }>;
}

export default function SettingsPage({ params }: SettingsPageProps) {
  // 1) Use the hook:
  const router = useRouter();
  const { classroomId, isLoading, error, isClassroomValid } =
    useClassroomAuth(params);

  // 2) Local states for rename, removing students, etc.
  const [className, setClassName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // 3) Handle classroomId parse errors
  if (classroomId !== null && Number.isNaN(classroomId)) {
    return <div>Invalid classroom ID</div>;
  }

  // 4) If still loading (RTK Query or param), show a spinner
  if (classroomId === null || isLoading) {
    return <div>Loading...</div>;
  }

  // 5) If request had an error (like 401), show an error
  if (error) {
    console.error("Error fetching classrooms:", error);
    return <div>Failed to load data. Maybe not authorized?</div>;
  }

  // 6) If the user doesn't have the ID, the hook already redirected
  // but we might check isClassroomValid === false and show something.
  // If "null", not determined yet, but typically we handle in effect.
  if (isClassroomValid === false) {
    return <div>Loading...</div>;
  }

  // If we get here, isClassroomValid is true
  // Sample data for demonstration
  const students: Student[] = [
    { id: 1, name: "Student 1" },
    { id: 2, name: "Student 2" },
    { id: 3, name: "Student 3" },
    { id: 4, name: "Student 4" },
    // ... more
  ];

  // Filter logic
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ---------------- RENAME CLASSROOM ---------------- */
  const handleRenameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClassName(e.target.value);
  };

  const handleRenameSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Renaming classroom to:", className);
    // TODO: call your rename API
  };

  /* ---------------- REMOVE STUDENTS ---------------- */
  const handleStudentSelect = (studentId: number) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students.map((s) => s.id));
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSave = () => {
    console.log("Removing students with IDs:", selectedStudents);
    // TODO: call your remove-students API
  };

  /* ---------------- DELETE CLASSROOM ---------------- */
  const handleDeleteClassroom = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteClassroom = () => {
    console.log("Classroom deleted.");
    // TODO: call your delete API
    setShowDeleteModal(false);
  };

  // 7) Render the full page once authorized & loaded
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Classroom Settings</h1>

      {/* Rename Classroom Section */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Rename Classroom</h2>
        <p className="text-gray-600 mb-4">
          Update the name of your classroom. Make it descriptive so students can
          easily identify it.
        </p>
        <form onSubmit={handleRenameSubmit} className="space-y-4">
          <input
            type="text"
            id="className"
            placeholder="Enter new classroom name"
            value={className}
            onChange={handleRenameChange}
            className="px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Name
          </button>
        </form>
      </div>

      {/* Remove Students Section */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Remove Students</h2>
        <p className="text-gray-600 mb-4">
          Search for students below and select them to remove from the
          classroom. Then click &quot;Save&quot; to apply changes.
        </p>

        {/* Search Input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Select All Toggle */}
        <label className="inline-flex items-center mb-4 cursor-pointer">
          <input
            type="checkbox"
            className="mr-2"
            checked={
              selectedStudents.length === students.length && students.length > 0
            }
            onChange={handleSelectAll}
          />
          <span className="select-none">Select All</span>
        </label>

        {/* Student Cards in a Responsive Grid */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {filteredStudents.map((student) => {
            const isChecked = selectedStudents.includes(student.id);
            return (
              <div
                key={student.id}
                className="border border-gray-200 rounded-lg p-4 flex items-center hover:shadow-md transition-shadow"
              >
                <input
                  type="checkbox"
                  className="mr-2 h-5 w-5 accent-blue-600"
                  checked={isChecked}
                  onChange={() => handleStudentSelect(student.id)}
                />
                <label className="cursor-pointer select-none">
                  {student.name}
                </label>
              </div>
            );
          })}
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Save
        </button>
      </div>

      {/* Delete Classroom Section (Danger Zone) */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-red-600">Danger Zone</h2>
        <p className="text-gray-600 mb-4">
          Deleting your classroom is permanent and cannot be undone. Make sure
          you really want to remove this classroom along with all its data.
        </p>
        <button
          onClick={handleDeleteClassroom}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Delete Classroom
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete this classroom? This action cannot
              be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteClassroom}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
