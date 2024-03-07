from django.db import models
from django.conf import settings


class Classroom(models.Model):
    name = models.CharField(max_length=200)
    teacher = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='classes_taught')
    students = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='classes_attended')
    

    def __str__(self):
        return self.name