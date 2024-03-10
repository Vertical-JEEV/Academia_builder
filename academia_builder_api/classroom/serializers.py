from rest_framework import serializers
from .models import Classroom
from django.contrib.auth import get_user_model


User = get_user_model()


# serializer for the classroom model
class ClassroomSerializer(serializers.ModelSerializer):
    students = serializers.PrimaryKeyRelatedField(many=True, required=False, queryset=User.objects.all())
    teacher = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Classroom
        fields = ['name', 'teacher', 'students', 'unique_code']

    def create(self, validated_data):
        students = validated_data.pop('students', [])
        classroom = Classroom.objects.create(**validated_data)
        for student in students:
            classroom.students.add(student)
        return classroom