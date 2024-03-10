from django.urls import path
from .views import ListClassroomsView, CreateClassroomView, RenameClassroomView, DeleteClassroomView, RemoveStudentView ,JoinClassroomView



# urlpatterns for the classroom app
urlpatterns = [
    path('list-classrooms/', ListClassroomsView.as_view(), name='list_classrooms'),
    path('create/', CreateClassroomView.as_view(), name='create_classroom'),
    path('rename/<int:pk>/', RenameClassroomView.as_view(), name='rename_classroom'),
    path('delete/<int:pk>/', DeleteClassroomView.as_view(), name='delete_classroom'),
    path('<int:classroom_id>/remove-student/<int:student_id>/', RemoveStudentView.as_view(), name='remove_student'),
    path('join-student/', JoinClassroomView.as_view(), name='join_classroom'),
]
