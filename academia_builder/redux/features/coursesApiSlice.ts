import { apiSlice } from "../services/apiSlice";

interface ListModulesArgs {
  course_id: number;
}

interface FilterQuestionsArgs extends ListModulesArgs {
  module_id?: number[];
  subtopic_id?: number[];
}

const coursesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    listCourses: builder.query<void, void>({
      query: () => ({
        url: `/courses/list-courses/`,
        method: "GET",
      }),
    }),

    listModulesAndSubtopics: builder.query<void, ListModulesArgs>({
      query: ({ course_id }) => ({
        url: `/courses/retrieve-topic-list/${course_id}/`,
        method: "GET",
      }),
    }),

    filterQuestions: builder.query<void, FilterQuestionsArgs>({
      query: ({ course_id, module_id, subtopic_id }) => {
        const params = new URLSearchParams();
        if (module_id) {
          params.append('module_ids', module_id.join(','));
        }
        if (subtopic_id) {
          params.append('subtopics_ids', subtopic_id.join(','));
        }
        return {
          url: `/courses/filter-questions/${course_id}/?${params.toString()}`,
          method: "GET",
        };
      },
    }),
  }),
});

export const {
  useListCoursesQuery,
  useListModulesAndSubtopicsQuery,
  useFilterQuestionsQuery,
} = coursesApiSlice;