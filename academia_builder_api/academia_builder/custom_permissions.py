from rest_framework import permissions

# custom permissions for the API endpoints


# makes sure the account is a teacher type
class IsTeacher(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.account_type == 'teacher'


# makes sure the account is a student type
class IsStudent(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.account_type == 'student'


# makes sure the account is a teacher or student type
class IsTeacherOrStudent(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and (request.user.account_type == 'teacher' or request.user.account_type == 'student')
