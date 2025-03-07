from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Classroom
from courses.models import Course

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
            # Drop any fields that are not in the `fields` list
            allowed = set(fields)
            existing = set(self.fields.keys())
            for field_name in existing - allowed:
                self.fields.pop(field_name)


# Simple base user serializer
class UserBaseSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'full_name']

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"


# Student and Teacher can be basically the same pattern
class StudentSerializer(UserBaseSerializer):
    class Meta(UserBaseSerializer.Meta):
        fields = UserBaseSerializer.Meta.fields


class TeacherSerializer(UserBaseSerializer):
    class Meta(UserBaseSerializer.Meta):
        fields = UserBaseSerializer.Meta.fields


class ClassroomSerializer(DynamicFieldsModelSerializer):
    """
    Combines:
      - `teacher_id` (HiddenField) to set teacher from request.user on create
      - A read-only nested `teacher` for GET responses
      - `students` as read-only, or you can let them be written if you prefer
      - `course` as SlugRelatedField
    """

    # Write logic: teacher_id is hidden and auto-assigns from request.user
    teacher_id = serializers.HiddenField(
        default=serializers.CurrentUserDefault())
    # Read logic: show teacher details in nested form
    teacher = TeacherSerializer(read_only=True)

    # For students, read-only in this example
    students = StudentSerializer(many=True, read_only=True)

    # Slug-based course
    course = serializers.SlugRelatedField(
        slug_field='name',
        queryset=Course.objects.all()
    )

    class Meta:
        model = Classroom
        fields = [
            'id',
            'name',
            'teacher_id',  # hidden for writes
            'teacher',     # nested read-only
            'students',
            'course',
            'unique_code'
        ]

    def validate_course(self, value):
        if not value:
            raise serializers.ValidationError('A course must be selected.')
        return value

    def create(self, validated_data):
        """
        `teacher_id` will appear in validated_data with the current user,
        thanks to HiddenField + CurrentUserDefault.
        """
        teacher_user = validated_data.pop(
            'teacher_id')  # remove from validated_data
        # If you want to handle students from request, remove read_only=True
        # and handle them similarly here, e.g. `students = validated_data.pop('students', [])`
        classroom = Classroom.objects.create(
            teacher=teacher_user, **validated_data)
        # If you had a list of students from request data:
        # for student in students:
        #     classroom.students.add(student)
        return classroom
