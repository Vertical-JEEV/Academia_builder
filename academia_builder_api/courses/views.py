from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from users.authentication import CustomJWTAuthentication
from django.db.models import Q  # allows for complex queries
from .models import Course, Module, Question
from classroom.models import Classroom
from django.shortcuts import get_object_or_404
from .serializers import CourseSerializer, ModuleSerializer, QuestionSerializer
from common.permissions import IsTeacherOrStudent


class ListCoursesView(APIView):
    authentication_classes = [CustomJWTAuthentication]
    permission_classes = [IsAuthenticated, IsTeacherOrStudent]

    # get request to list courses
    def get(self, request):
        courses = Course.objects.all()
        serializer = CourseSerializer(courses, many=True)
        return Response(serializer.data)


# get request to retrieve modules and sub-topics of a course
class RetrieveModulesAndSubTopicsView(APIView):
    authentication_classes = [CustomJWTAuthentication]
    permission_classes = [IsAuthenticated, IsTeacherOrStudent]

    # get request to retrieve  all of the modules and sub-topics of a course
    def get(self, request, pk):
        object_type = request.query_params.get("type")

        if object_type == "classroom":
            classroom = get_object_or_404(Classroom, id=pk)
            course = classroom.course
        elif object_type == "course":
            course = get_object_or_404(Course, id=pk)
        else:
            return Response({"error": "Must specify ?type=course or ?type=classroom"}, status=400)

        modules = Module.objects.filter(course=course)
        serializer = ModuleSerializer(modules, many=True)
        return Response(serializer.data)
  

class FilterQuestionsByModuleAndSubTopicView(APIView):
    authentication_classes = [CustomJWTAuthentication]
    permission_classes = [IsAuthenticated, IsTeacherOrStudent]

    # get request to filter questions by multiple modules and multiple sub-topics of a course
    def get(self, request, course_id):
        module_ids = request.query_params.get('module_ids', '')
        subtopics_ids = request.query_params.get('subtopics_ids', '')

        # Convert ids from string to list of integers
        module_ids = list(map(int, module_ids.split(','))
                          ) if module_ids else []
        subtopics_ids = list(
            map(int, filter(None, subtopics_ids.split(',')))) if subtopics_ids else []

        # Filter questions based on module_ids, subtopics_ids, and course_id
        if module_ids or subtopics_ids:
            questions = Question.objects.filter(
                Q(subtopic__module_id__in=module_ids) | Q(
                    subtopic_id__in=subtopics_ids),
            )
        else:
            # If no module_ids or subtopics_ids are provided, return all questions for the course
            questions = Question.objects.filter(
                subtopic__module__course_id=course_id)

        serializer = QuestionSerializer(questions, many=True)
        return Response(serializer.data)
