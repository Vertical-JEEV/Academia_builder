from django.db import models
from django.conf import settings
from django.utils.crypto import get_random_string

# function to generate unique code for classroom since we cant call it directly in the model
def generate_unique_code():
    return get_random_string(10)

# model for storing classrooms
class Classroom(models.Model):
    name = models.CharField(max_length=200) # name of the classroom
    teacher = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='classes_taught') # teacher of the classroom
    students = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='classes_attended') # students of the classroom
    unique_code = models.CharField(max_length=10, unique=True, default=generate_unique_code) # unique code for joining the classroom 


    def __str__(self):
        return self.name
    

