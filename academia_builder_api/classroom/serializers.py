from rest_framework import serializers
from .models import Classroom, Course

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'title', 'description']

class ClassroomSerializer(serializers.ModelSerializer):
    course = CourseSerializer()
    class Meta:
        model = Classroom
        fields = ['id', 'name', 'teacher', 'students', 'course']
