from rest_framework import serializers
from .models import Classroom
from courses.models import Course
from django.contrib.auth import get_user_model

User = get_user_model()


# course serializers for making sure teacher enters a valid course
class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['name']

    def to_representation(self, instance):
        return instance.name


class ClassroomSerializer(serializers.ModelSerializer):
    students = serializers.PrimaryKeyRelatedField(
        many=True, required=False, queryset=User.objects.all())
    teacher = serializers.HiddenField(default=serializers.CurrentUserDefault())
    # slugrelatedfield is used to get the name of the course instead of the id
    course = serializers.SlugRelatedField(
        slug_field='name', queryset=Course.objects.all())

    class Meta:
        model = Classroom
        fields = ['id','name', 'teacher', 'students', 'course', 'unique_code']

    def validate_course(self, value):
        # check if the course exists
        if not value:
            raise serializers.ValidationError('A course must be selected.')
        return value

    def create(self, validated_data):
        students = validated_data.pop('students', [])
        classroom = Classroom.objects.create(**validated_data)
        for student in students:
            classroom.students.add(student)
        return classroom
