from django.urls import path
from .views import ListCoursesView, RetrieveModulesAndSubTopicsView, FilterQuestionsByModuleAndSubTopicView

urlpatterns = [
    path('list-courses/', ListCoursesView.as_view(), name='list_courses'),
    path('retrieve-topic-list/<int:pk>/',
         RetrieveModulesAndSubTopicsView.as_view(), name='retrieve_modules_and_subtopics'),
    path('filter-questions/<int:course_id>/', FilterQuestionsByModuleAndSubTopicView.as_view(),
         name='filter_questions_by_module_and_subtopic'),
]
