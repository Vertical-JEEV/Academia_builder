from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'academia_builder.settings')

app = Celery('academia_builder')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

app.conf.timezone = 'Europe/London'

app.conf.beat_schedule = {
    'delete-inactive-users-at-midnight': {
        'task': 'users.tasks.delete_inactive_users',
        'schedule': crontab(hour=0, minute=0), # every day at midnight
    },
}