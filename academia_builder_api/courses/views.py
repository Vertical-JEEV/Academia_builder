from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from users.authentication import CustomJWTAuthentication
from users.models import UserAccount as User
from .models import Course, Module, SubTopic, Question
from .serializers import CourseSerializer, ModuleSerializer, SubTopicSerializer, QuestionSerializer
from academia_builder.custom_permissions import IsTeacherOrStudent




class ListCoursesView(APIView):
    authentication_classes = [CustomJWTAuthentication]
    permission_classes = [IsAuthenticated, IsTeacherOrStudent]

    # get request to list courses



class RetrieveModulesAndSubTopicsView(APIView):
    authentication_classes = [CustomJWTAuthentication]
    permission_classes = [IsAuthenticated, IsTeacherOrStudent]

    # get request to retrieve modules and sub-topics of a course


class FilterQuestionsByModuleAndSubTopicView(APIView):
    authentication_classes = [CustomJWTAuthentication]
    permission_classes = [IsAuthenticated, IsTeacherOrStudent]

    # get request to filter questions by module and sub-topic of a course