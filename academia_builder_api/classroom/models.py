from django.db import models
from django.conf import settings
import uuid


# model for storing classrooms
class Classroom(models.Model):
    name = models.CharField(max_length=200) # name of the classroom
    teacher = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='classes_taught') # teacher of the classroom
    students = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='classes_attended') # students of the classroom
    

    def __str__(self):
        return self.name
    
# model for storing invitations to students from teachers
class Invitation(models.Model):
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE) # student's classroom
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE) # student being invited
    token = models.UUIDField(default=uuid.uuid4, editable=False) # token for the invitation
    accepted = models.BooleanField(default=False) # whether the invitation has been accepted
    date_created = models.DateTimeField(auto_now_add=True) # date the invitation was created
    date_accepted = models.DateTimeField(null=True, blank=True) # date the invitation was accepted

    def __str__(self):
        return f'{self.student} invited to {self.classroom}'