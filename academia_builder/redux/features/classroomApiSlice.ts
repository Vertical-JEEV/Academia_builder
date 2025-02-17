import { apiSlice } from "../services/apiSlice";

interface CreateClassroomArgs {
  name: string;
  course: string;
}
interface DeleteClassroomArgs {
  id: number;
}

interface RenameClassroomArgs extends DeleteClassroomArgs {
  name: string;
}

interface JoinStudentArgs {
  unique_code: string;
}

interface RemoveStudentArgs {
  classroom_id: number;
  student_id: number;
}

interface Classroom {
  classroom_name: string;
  students: number[];
  course: string;
  unique_code: string;
}

const classroomApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createClassroom: builder.mutation<void, CreateClassroomArgs>({
      query: ({ name, course }) => ({
        url: `classroom/create/`,
        method: "POST",
        body: { name, course },
      }),
    }),

    deleteClassroom: builder.mutation<void, DeleteClassroomArgs>({
      query: ({ id }) => ({
        url: `classroom/delete/${id}/`,
        method: "DELETE",
      }),
    }),

    renameClassroom: builder.mutation<void, RenameClassroomArgs>({
      query: ({ id, name }) => ({
        url: `classroom/rename/${id}/`,
        method: "PATCH",
        body: { name },
      }),
    }),

    joinStudent: builder.mutation<void, JoinStudentArgs>({
      query: ({ unique_code }) => ({
        url: `classroom/join/`,
        method: "POST",
        body: { unique_code },
      }),
    }),

    removeStudent: builder.mutation<void, RemoveStudentArgs>({
      query: ({ classroom_id, student_id }) => ({
        url: `classroom/${classroom_id}/remove/${student_id}/`,
        method: "DELETE",
      }),
    }),

    listClassrooms: builder.query<Classroom, void>({
      query: () => `classroom/list-classrooms/`,
    }),
  }),
});

export const {
  useCreateClassroomMutation,
  useDeleteClassroomMutation,
  useRenameClassroomMutation,
  useJoinStudentMutation,
  useRemoveStudentMutation,
  useListClassroomsQuery,
} = classroomApiSlice;
