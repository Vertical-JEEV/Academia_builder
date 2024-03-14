from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from users.authentication import CustomJWTAuthentication
from django.db.models import Q # allows for complex queries
from .models import Course, Module, Question
from .serializers import CourseSerializer, ModuleSerializer, QuestionSerializer
from academia_builder.custom_permissions import IsTeacherOrStudent


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
    def get(self, request, course_id):
        modules = Module.objects.filter(course_id=course_id)
        serializer = ModuleSerializer(modules, many=True)
        return Response(serializer.data)

class FilterQuestionsByModuleAndSubTopicView(APIView):
    authentication_classes = [CustomJWTAuthentication]
    permission_classes = [IsAuthenticated, IsTeacherOrStudent]

    # get request to filter questions by multiple modules and multiple sub-topics of a course
    def get(self, request):
        module_ids = request.query_params.get('module_ids', [])
        subtopics_ids = request.query_params.get('subtopics_ids', [])

        # Convert ids from string to list of integers
        module_ids = list(map(int, module_ids.split(','))) if module_ids else []
        subtopics_ids = list(map(int, subtopics_ids.split(','))) if subtopics_ids else []

        # Filter questions based on module_ids and subtopics_ids
        questions = Question.objects.filter(Q(subtopic__module_id__in=module_ids) | Q(subtopic_id__in=subtopics_ids))


        serializer = QuestionSerializer(questions, many=True)
        return Response(serializer.data)




        
        pass
        