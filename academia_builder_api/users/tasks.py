from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from .models import UserAccount

@shared_task
def delete_inactive_users():
    threshold_time = timezone.now() - timedelta(days=1) # didnt complete registration in 1 day
    inactive_users = UserAccount.objects.filter(is_active=False, date_joined__lt=threshold_time)
    inactive_users.delete()