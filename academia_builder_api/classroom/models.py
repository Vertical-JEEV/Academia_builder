from django.db import models
from django.conf import settings
from django.utils.crypto import get_random_string
from courses.models import Course

# function to generate unique code for classroom since we cant call it directly in the model
CODE_LENGTH = 10


def generate_unique_code():
    return get_random_string(CODE_LENGTH)

# model for storing classrooms


class Classroom(models.Model):
    name = models.CharField(max_length=200)  # name of the classroom
    teacher = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
                                related_name='classes_taught')  # teacher of the classroom
    students = models.ManyToManyField(
        settings.AUTH_USER_MODEL, related_name='classes_attended')  # students of the classroom
    # course of the classroom avaible to students and teachers
    course = models.ForeignKey(
        Course, on_delete=models.CASCADE, related_name='classrooms', null=True)
    # unique code for joining the classroom
    unique_code = models.CharField(
        max_length=CODE_LENGTH, unique=True, default=generate_unique_code)

    def __str__(self):
        return self.name
