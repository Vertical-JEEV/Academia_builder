from django.urls import path
from . import views

urlpatterns = [
    path('create-classroom/', views.CreateClassroom.as_view(), name='create-classroom'),
    path('invite-student/', views.InviteStudent.as_view(), name='invite-student'),
    path('confirm-invitation/', views.AcceptInvitation.as_view(), name='accept-invitation'),
    path('rename-classroom/<int:pk>/', views.RenameClassroom.as_view(), name='rename-classroom'),
    path('delete-classroom/<int:pk>/', views.DeleteClassroom.as_view(), name='delete-classroom'),
    path('remove-student/', views.RemoveStudent.as_view(), name='remove-student'),
]