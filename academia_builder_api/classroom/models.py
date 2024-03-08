from django.db import models
from django.conf import settings
from django.utils.crypto import get_random_string



# model for storing classrooms
class Classroom(models.Model):
    name = models.CharField(max_length=200) # name of the classroom
    teacher = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='classes_taught') # teacher of the classroom
    students = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='classes_attended') # students of the classroom
    unique_code = models.CharField(max_length=10, unique=True, default=get_random_string) # unique code for joining the classroom 


    def __str__(self):
        return self.name
    

