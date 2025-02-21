from django.conf import settings
from django.core.cache import cache
from django.contrib.auth import get_user_model
from django.db import transaction
from djoser.social.views import ProviderAuthView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from .exceptions import NewUserException
from .serializers import CustomTokenObtainPairSerializer


import logging

logger = logging.getLogger(__name__)
User = get_user_model()


class CompleteSignupView(APIView):

    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):

        # "signup_token" or "token" from the front end
        token = request.data.get("token")
        account_type = request.data.get("account_type")

        if not token or account_type not in ["student", "teacher"]:
            return Response(
                {"error": "Valid token and valid account_type are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Retrieve temporary user details from Redis using the token
        user_data = cache.get(f"pending_user:{token}")
        if not user_data:
            return Response(
                {"error": "No pending user found. Please restart OAuth process."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Typically, user_data would have keys like "email", "first_name", etc.
        email = user_data.get("email")
        if not email:
            return Response(
                {"error": "No email found in cached data. Something is wrong."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create the new user in an atomic transaction
        with transaction.atomic():
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    "first_name": user_data.get("first_name", ""),
                    "last_name": user_data.get("last_name", ""),
                    "account_type": account_type
                }
            )

            if not created:
                return Response(
                    {"error": "User already exists."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # Delete temporary user details from Redis
        cache.delete(f"pending_user:{token}")
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        response = Response(
            {"message": "User registration completed.",
             "account_type": account_type
             }, status=status.HTTP_201_CREATED)
        response.set_cookie(
            "access", access_token,
            max_age=settings.AUTH_COOKIE_ACCESS_MAX_AGE,
            path=settings.AUTH_COOKIE_PATH,
            secure=settings.AUTH_COOKIE_SECURE,
            httponly=settings.AUTH_COOKIE_HTTP_ONLY,
            samesite=settings.AUTH_COOKIE_SAMESITE
        )
        response.set_cookie(
            "refresh", refresh_token,
            max_age=settings.AUTH_COOKIE_REFRESH_MAX_AGE,
            path=settings.AUTH_COOKIE_PATH,
            secure=settings.AUTH_COOKIE_SECURE,
            httponly=settings.AUTH_COOKIE_HTTP_ONLY,
            samesite=settings.AUTH_COOKIE_SAMESITE
        )
        return response


class CustomProviderAuthView(ProviderAuthView):
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            # If user is authenticated, set JWT tokens as cookies
            logger.debug(f"{response.data}\n")
            if response.status_code == 201:
                access_token = response.data.get('access')
                refresh_token = response.data.get('refresh')
                email = response.data.get('user')
                user = User.objects.get(email=email)
                account_type = user.account_type
                
                

                response.set_cookie(
                    'access',
                    access_token,
                    max_age=settings.AUTH_COOKIE_ACCESS_MAX_AGE,
                    path=settings.AUTH_COOKIE_PATH,
                    secure=settings.AUTH_COOKIE_SECURE,
                    httponly=settings.AUTH_COOKIE_HTTP_ONLY,
                    samesite=settings.AUTH_COOKIE_SAMESITE
                )

                response.set_cookie(
                    'refresh',
                    refresh_token,
                    max_age=settings.AUTH_COOKIE_REFRESH_MAX_AGE,
                    path=settings.AUTH_COOKIE_PATH,
                    secure=settings.AUTH_COOKIE_SECURE,
                    httponly=settings.AUTH_COOKIE_HTTP_ONLY,
                    samesite=settings.AUTH_COOKIE_SAMESITE
                )
                response.data['account_type'] = account_type
            return response
        except NewUserException as e:

            return Response(
                {'is_new': True, 'token': str(e)},
                status=status.HTTP_200_OK
            )


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):

        response = super().post(request, *args, **kwargs)
        logger.debug(f"{response.data}\n")

        # if the response status code is 200, then we set the access and refresh tokens as cookies
        if response.status_code == 200:
            access_token = response.data.get('access')
            refresh_token = response.data.get('refresh')
            

            response.set_cookie(
                'access',
                access_token,
                max_age=settings.AUTH_COOKIE_ACCESS_MAX_AGE,
                path=settings.AUTH_COOKIE_PATH,
                secure=settings.AUTH_COOKIE_SECURE,
                httponly=settings.AUTH_COOKIE_HTTP_ONLY,
                samesite=settings.AUTH_COOKIE_SAMESITE
            )

            response.set_cookie(
                'refresh',
                refresh_token,
                max_age=settings.AUTH_COOKIE_REFRESH_MAX_AGE,
                path=settings.AUTH_COOKIE_PATH,
                secure=settings.AUTH_COOKIE_SECURE,
                httponly=settings.AUTH_COOKIE_HTTP_ONLY,
                samesite=settings.AUTH_COOKIE_SAMESITE
            )
            

            return response


class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh')

        # if the refresh token is present in the request, then we set it as a cookie
        if refresh_token:
            request.data['refresh'] = refresh_token

        response = super().post(request, *args, **kwargs)

        # if the response status code is 200, then we set the access token as a cookie
        if response.status_code == 200:
            access_token = response.data.get('access')

            response.set_cookie(
                'access',
                access_token,
                max_age=settings.AUTH_COOKIE_ACCESS_MAX_AGE,
                path=settings.AUTH_COOKIE_PATH,
                secure=settings.AUTH_COOKIE_SECURE,
                httponly=settings.AUTH_COOKIE_HTTP_ONLY,
                samesite=settings.AUTH_COOKIE_SAMESITE
            )

        return response


class CustomTokenVerifyView(TokenVerifyView):
    def post(self, request, *args, **kwargs):
        # if the access token is present in the request, then we set it as a cookie

        access_token = request.COOKIES.get('access')

        if access_token:
            request.data['token'] = access_token

        return super().post(request, *args, **kwargs)


class LogoutView(APIView):

    # this view is used to logout the user, we delete the access and refresh tokens from the cookies.

    # this means that user wont be authorised to access the API anymore. essentially logging them out
    def post(self, request, *args, **kwargs):
        response = Response(status=status.HTTP_204_NO_CONTENT)
        response.delete_cookie('access')
        response.delete_cookie('refresh')

        return response
