'use client';

import { useState } from "react";

export default function SettingsPage() {
  const [className, setClassName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const students = [
    { id: 1, name: "Student 1" },
    { id: 2, name: "Student 2" },
    { id: 3, name: "Student 3" },
    // Add more students as needed
  ];

  const handleRenameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClassName(e.target.value);
  };

  const handleRenameSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Implement rename functionality here
  };

  const handleDeleteClassroom = () => {
    // Implement delete functionality here
  };

  const handleStudentSelect = (studentId: number) => {
    setSelectedStudents((prevSelected) =>
      prevSelected.includes(studentId)
        ? prevSelected.filter((id) => id !== studentId)
        : [...prevSelected, studentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students.map((student) => student.id));
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = () => {
    // Implement save functionality here
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Classroom Settings</h1>

      <form onSubmit={handleRenameSubmit} className="mb-6">
        <label className="block text-lg font-medium mb-2" htmlFor="className">
          Rename Classroom
        </label>
        <input
          type="text"
          id="className"
          value={className}
          onChange={handleRenameChange}
          className="mb-4 px-4 py-2 border rounded-lg w-full"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Rename
        </button>
      </form>

      <button
        onClick={handleDeleteClassroom}
        className="mb-6 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        Delete Classroom
      </button>

      <h2 className="text-2xl font-bold mb-4">Remove Students</h2>
      <input
        type="text"
        placeholder="Search students"
        value={searchTerm}
        onChange={handleSearchChange}
        className="mb-4 px-4 py-2 border rounded-lg w-full"
      />
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={selectedStudents.length === students.length}
            onChange={handleSelectAll}
            className="mr-2"
          />
          Select All
        </label>
      </div>
      <ul className="divide-y divide-gray-200">
        {filteredStudents.map((student) => (
          <li key={student.id} className="py-2 flex justify-between items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectedStudents.includes(student.id)}
                onChange={() => handleStudentSelect(student.id)}
                className="mr-2"
              />
              {student.name}
            </label>
          </li>
        ))}
      </ul>
      <button
        onClick={handleSave}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        Save
      </button>
    </div>
  );
}