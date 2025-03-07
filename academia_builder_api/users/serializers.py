from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenVerifySerializer
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.exceptions import InvalidToken
from django.contrib.auth import get_user_model

User = get_user_model()


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user
        data['account_type'] = user.account_type
        return data
    

class CustomTokenVerifySerializer(TokenVerifySerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        token = attrs['token']

        try:
            # Decode the token to get the user ID
            untyped_token = UntypedToken(token)
            user_id = untyped_token['user_id']
            user = User.objects.get(id=user_id)
            data['account_type'] = user.account_type
        except (InvalidToken, User.DoesNotExist):
            raise ValidationError("Invalid token or user does not exist.")

        return data
