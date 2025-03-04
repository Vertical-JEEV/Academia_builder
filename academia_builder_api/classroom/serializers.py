# serializers.py
from rest_framework import serializers
from .models import Classroom
from courses.models import Course
from django.contrib.auth import get_user_model

User = get_user_model()


class DynamicFieldsModelSerializer(serializers.ModelSerializer):
    """
    A ModelSerializer that takes an additional `fields` argument that
    controls which fields should be displayed.
    """

    def __init__(self, *args, **kwargs):
        # Don't pass the 'fields' arg up to the superclass
        fields = kwargs.pop('fields', None)

        # Instantiate the superclass normally
        super().__init__(*args, **kwargs)

        if fields is not None:
            # Drop any fields that are not in the `fields` list.
            allowed = set(fields)
            existing = set(self.fields.keys())
            for field_name in existing - allowed:
                self.fields.pop(field_name)


class ClassroomSerializer(DynamicFieldsModelSerializer):
    students = serializers.PrimaryKeyRelatedField(
        many=True, required=False, queryset=User.objects.all()
    )
    teacher = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), default=serializers.CurrentUserDefault()
    )
    teacher_name = serializers.SerializerMethodField()
    course = serializers.SlugRelatedField(
        slug_field='name', queryset=Course.objects.all()
    )

    class Meta:
        model = Classroom
        fields = [
            'id',
            'name',
            'teacher',
            'teacher_name',
            'students',
            'course',
            'unique_code'
        ]

    def get_teacher_name(self, obj):
        return (
            f"{obj.teacher.first_name} {obj.teacher.last_name}"
            if obj.teacher else None
        )

    def validate_course(self, value):
        if not value:
            raise serializers.ValidationError('A course must be selected.')
        return value

    def create(self, validated_data):
        students = validated_data.pop('students', [])
        classroom = Classroom.objects.create(**validated_data)
        for student in students:
            classroom.students.add(student)
        return classroom
