from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from users.authentication import CustomJWTAuthentication
from users.models import UserAccount as User
from .models import Classroom
from .serializers import ClassroomSerializer
from academia_builder.custom_permissions import IsTeacher, IsStudent, IsTeacherOrStudent


class ListClassroomsView(APIView):
    authentication_classes = [CustomJWTAuthentication]
    permission_classes = [IsAuthenticated, IsTeacherOrStudent]

    # get request to list classsrooms
    def get(self, request):
        # if the user is a teacher, then return the classrooms taught by the teacher
        if request.user.account_type == 'teacher':
            classrooms = Classroom.objects.filter(teacher=request.user)
            serializer = ClassroomSerializer(classrooms, many=True)
            return Response(serializer.data)
        # if the user is a student, then return the classrooms attended by the student
        elif request.user.account_type == 'student':
            classrooms = request.user.classes_attended.all()
            serializer = ClassroomSerializer(classrooms, many=True)
            return Response(serializer.data)


# creates a classroom which will link to the teacher
class CreateClassroomView(APIView):
    # makes sure that the user is authenticated
    authentication_classes = [CustomJWTAuthentication]
    # makes sure that the user is authenticated and is a teacher
    permission_classes = [IsAuthenticated, IsTeacher]

    # post request to create a classroom
    def post(self, request):
        serializer = ClassroomSerializer(
            data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


# allows for a teacher to rename their classroom
class RenameClassroomView(APIView):
    authentication_classes = [CustomJWTAuthentication]
    permission_classes = [IsAuthenticated, IsTeacher]

    # put request to rename a classroom

    def patch(self, request, pk):
        try:
            classroom = Classroom.objects.get(id=pk)
            # makes sure that the teacher is the owner of the classroom
            if classroom.teacher != request.user:
                return Response({"error": "Not authorized"}, status=403)
            new_name = request.data.get('name')
            # makes sure that the new name is not empty or that the new name is not the same as the old name
            if new_name:
                classroom.name = new_name
                classroom.save()
                return Response({"message": "Classroom renamed successfully"})
            return Response({"error": "Name is required"}, status=400)
        except Classroom.DoesNotExist:
            return Response({"error": "Classroom not found"}, status=404)


class DeleteClassroomView(APIView):
    authentication_classes = [CustomJWTAuthentication]
    permission_classes = [IsAuthenticated, IsTeacher]

    def delete(self, request, pk):
        try:
            # gets the classroom with the id
            classroom = Classroom.objects.get(id=pk)
            # if the teacher is not the owner of the classroom, then return an error else we delete the classroom and return a success message
            if classroom.teacher != request.user:
                return Response({"error": "Not authorized"}, status=403)
            classroom.delete()
            return Response({"message": f"Classroom with id {pk} deleted"}, status=200)

        except Classroom.DoesNotExist:
            return Response({"error": "Classroom not found"}, status=404)


class RemoveStudentView(APIView):
    authentication_classes = [CustomJWTAuthentication]
    permission_classes = [IsAuthenticated, IsTeacher]


# removes a student from a classroom


    def delete(self, request, classroom_id, student_id):
        try:
            classroom = Classroom.objects.get(id=classroom_id)
            # if the teacher is not the owner of the classroom, then return an error else we remove the student from the classroom and return a success message
            if classroom.teacher != request.user:
                return Response({"error": "Not authorized"}, status=403)
            student = User.objects.get(id=student_id)
            classroom.students.remove(student)
            return Response({"message": f"Removed student with id {student_id} from classroom with id {classroom_id}"}, status=200)
        except Classroom.DoesNotExist:
            return Response({"error": "Classroom not found"}, status=404)
        except User.DoesNotExist:
            return Response({"error": "Student not found"}, status=404)


class JoinClassroomView(APIView):
    authentication_classes = [CustomJWTAuthentication]
    permission_classes = [IsAuthenticated, IsStudent]

    # post request to join a classroom

    def post(self, request):
        unique_code = request.data.get('unique_code')

        # makes sure that the unique code is not empty
        if not unique_code:
            return Response({"error": "Unique code is required"}, status=400)
        try:
            classroom = Classroom.objects.get(unique_code=unique_code)
        except Classroom.DoesNotExist:
            return Response({"error": "Invalid unique code"}, status=404)

        classroom.students.add(request.user)
        classroom.save()

        return Response({"message": "Successfully joined the classroom"})
