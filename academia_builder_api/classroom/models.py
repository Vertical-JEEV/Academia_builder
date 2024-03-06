from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()

class Classroom(models.Model):
    classroom_name = models.CharField(max_length=200)
    teacher = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.classroom_name

class StudentClassroom(models.Model):
    student = models.ForeignKey(User, related_name='classrooms', on_delete=models.CASCADE)
    classroom = models.ForeignKey(Classroom, related_name='students', on_delete=models.CASCADE)

    class Meta:
        unique_together = ('student', 'classroom')

    def __str__(self):
        return f'{self.student.username} - {self.classroom.classroom_name}'