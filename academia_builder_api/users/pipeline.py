# users/pipeline.py
from django.contrib.auth import get_user_model
from django.core.cache import cache
from .exceptions import NewUserException, NoEmailException
import logging
import uuid

User = get_user_model()
logger = logging.getLogger(__name__)




def store_temporary_user(backend, details, response, *args, **kwargs):
    """
    If a user with this email doesn't exist, store the user's details in Redis
    and raise an exception to stop normal user creation in Djoser.
    """
    email = details.get("email")
    if not email:
        # No email => can't do much, so raise forbidden or handle differently
        raise NoEmailException("No email found in OAuth response.")

    user = User.objects.filter(email=email).first()
    if user:
        # Existing user => pipeline continues, Djoser will eventually issue JWT
        
        return user

    # Otherwise, user does NOT exist => store details, then raise exception
    
    token = str(uuid.uuid4())   
    cache_key = f"pending_user:{token}"
    cache.set(cache_key, details, timeout=300)  # e.g., store for 5 minutes
    raise NewUserException(token)
