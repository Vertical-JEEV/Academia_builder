from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from users.authentication import CustomJWTAuthentication
from .models import Course
from .serializers import CourseSerializer, ModuleSerializer, SubTopicSerializer
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
        pass

class FilterQuestionsByModuleAndSubTopicView(APIView):
    authentication_classes = [CustomJWTAuthentication]
    permission_classes = [IsAuthenticated, IsTeacherOrStudent]

    # get request to filter questions by module and sub-topic of a course
    def get(self, request):
        pass