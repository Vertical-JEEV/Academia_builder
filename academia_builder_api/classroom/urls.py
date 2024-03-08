from django.urls import path
from .views import ListClassroomsView, CreateClassroomView, RenameClassroomView, DeleteClassroomView, RemoveStudentView ,JoinClassroomView


urlpatterns = [
    path('classrooms/', ListClassroomsView.as_view(), name='list_classrooms'),
    path('classrooms/create/', CreateClassroomView.as_view(), name='create_classroom'),
    path('classrooms/<int:pk>/rename/', RenameClassroomView.as_view(), name='rename_classroom'),
    path('classrooms/<int:pk>/delete/', DeleteClassroomView.as_view(), name='delete_classroom'),
    path('classrooms/<int:classroom_id>/remove-student/<int:student_id>/', RemoveStudentView.as_view(), name='remove_student'),
    path('classrooms/join/', JoinClassroomView.as_view(), name='join_classroom'),
]
