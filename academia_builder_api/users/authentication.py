from django.conf import settings
from rest_framework_simplejwt.authentication import JWTAuthentication


class CustomJWTAuthentication(JWTAuthentication):
    def authenticate(self, request): 

        try:
            # get the header from the request
            header = self.get_header(request)

            # if the header is None, then we get the token from the cookies
            if header is None:
                raw_token = request.COOKIES.get(settings.AUTH_COOKIE)

            # if the header is not None, then we get the token from the header
            else:
                raw_token = self.get_raw_token(header)

            if raw_token is None:
                return None

            validated_token = self.get_validated_token(raw_token)

            return self.get_user(validated_token), validated_token
        except:
            return None