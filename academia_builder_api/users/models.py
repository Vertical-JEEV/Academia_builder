from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin


class UserAccountManager(BaseUserManager):
    def create_user(self, email, password=None, **kwargs):
        # **kwargs is a dictionary that holds the rest of the fields

        if not email:
            raise ValueError('Users must have an email address')
        # lowercase the email address
        email = self.normalize_email(email)
        email = email.lower()
        user = self.model(
            email=email,
            **kwargs
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **kwargs):
        """
        Creates and saves a superuser with the given email, first name, last name, password,
        account type
        """
        user = self.create_user(
            email,
            password=password,
            **kwargs
        )
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class UserAccount(AbstractBaseUser, PermissionsMixin):

    USER_TYPE_CHOICES = (
        ('student', 'Student'), # the first value is the value stored in the database, the second value is the human-readable name
        ('teacher', 'Teacher'), # the first value is the value stored in the database, the second value is the human-readable name
    )
    # the email field is unique and it is used as the username field
    email = models.EmailField(unique=True, max_length=255)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    account_type = models.CharField(max_length=255, choices=USER_TYPE_CHOICES)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    objects = UserAccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'account_type']

    def __str__(self):
        return self.email
