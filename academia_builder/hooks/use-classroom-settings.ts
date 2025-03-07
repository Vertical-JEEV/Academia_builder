import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import {
  useDeleteClassroomMutation,
  useListClassroomsQuery,
  useRenameClassroomMutation,
  useRemoveStudentMutation,
} from '@/redux/features/classroomApiSlice';

interface Student {
  id: number;
  full_name: string;
}

export const useClassroomSettings = (classroomId: number | null) => {
  const router = useRouter();
  
  // States
  const [className, setClassName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);

  // API Mutations
  const [deleteClassroom] = useDeleteClassroomMutation();
  const [removeStudent] = useRemoveStudentMutation();
  const [renameClassroom] = useRenameClassroomMutation();
  const { data: classrooms, isLoading, error, refetch } = useListClassroomsQuery({ 
    fields: ["id", "name", "students"] 
  });

  // Effects
  useEffect(() => {
    if (classrooms && classroomId !== null) {
      const classroom = Array.isArray(classrooms)
        ? classrooms.find((c: { id: number }) => c.id === classroomId)
        : null;
      if (classroom) {
        setStudents(classroom.students);
        setClassName(classroom.name);
      }
    }
  }, [classrooms, classroomId]);

  // Change Handlers
  const handleRenameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClassName(e.target.value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Student Management
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

  const handleSave = async () => {
    if (selectedStudents.length === 0) {
      toast.warning("Please select students to remove");
      return;
    }

    try {
      if (classroomId !== null) {
        await removeStudent({
          classroom_id: classroomId,
          student_ids: selectedStudents,
        }).unwrap();
        toast.success("Students removed successfully");
        setSelectedStudents([]);
        refetch();
      } else {
        toast.error("Invalid classroom ID");
      }
    } catch (error) {
      console.error("Failed to remove students:", error);
      toast.error("Failed to remove students");
    }
  };

  // Classroom Management
  const handleRenameSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (classroomId !== null) {
        await renameClassroom({ id: classroomId, name: className }).unwrap();
        toast.success("Classroom renamed successfully");
        refetch();
      } else {
        toast.error("Failed to rename classroom: Invalid classroom ID");
      }
    } catch (error) {
      console.error("Failed to rename classroom:", error);
      toast.error("Failed to rename classroom");
    }
  };

  const handleDeleteClassroom = () => setShowDeleteModal(true);

  const confirmDeleteClassroom = async () => {
    try {
      if (classroomId !== null) {
        await deleteClassroom({ id: classroomId }).unwrap();
        toast.success("Classroom deleted successfully");
        router.push("/dashboard");
      } else {
        toast.error("Failed to delete classroom: Invalid classroom ID");
      }
    } catch (error) {
      console.error("Failed to delete classroom:", error);
      toast.error("Failed to delete classroom");
    } finally {
      setShowDeleteModal(false);
    }
  };

  // Computed Values
  const filteredStudents = students.filter((student) =>
    student.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    // States
    className,
    searchTerm,
    selectedStudents,
    showDeleteModal,
    students,
    filteredStudents,
    isLoading,
    error,

    // Setters
    setClassName,
    setSearchTerm,
    setShowDeleteModal,

    // Handlers
    handleStudentSelect,
    handleSelectAll,
    handleSave,
    handleRenameSubmit,
    handleRenameChange,
    handleSearchChange,
    handleDeleteClassroom,
    confirmDeleteClassroom,
  };
};