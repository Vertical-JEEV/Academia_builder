from django.urls import path
from . import views

urlpatterns = [
    path('create-classroom/', views.createClassroom, name='create_classroom'),
    path('invite-student/', views.inviteStudent, name='invite_student'),
    path('confirm-invite/', views.confirmInvitation, name='confirm_invitation'),
    path('rename-classroom/<int:pk>/', views.renameClassroom, name='rename_classroom'),
    path('delete-classroom/<int:pk>/', views.deleteClassroom, name='delete_classroom'),
    path('remove-student/', views.removeStudent, name='remove_student'),
]