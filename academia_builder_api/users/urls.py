from django.urls import path, re_path

from .views import CustomTokenObtainPairView, CustomTokenRefreshView, CustomTokenVerifyView, LogoutView, CustomProviderAuthView, CompleteSignupView

# the URL patterns for the users app
urlpatterns = [
    re_path(
        # the URL pattern for the provider auth view
        r'^o/(?P<provider>\S+)/$',
        CustomProviderAuthView.as_view(),
        name='provider-auth'
    ),
    path('complete-signup/', CompleteSignupView.as_view()),
    path('jwt/create/', CustomTokenObtainPairView.as_view()),
    path('jwt/refresh/', CustomTokenRefreshView.as_view()),
    path('jwt/verify/', CustomTokenVerifyView.as_view()),
    path('logout/', LogoutView.as_view())
]
