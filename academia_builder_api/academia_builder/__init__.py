from .celery import app as celery_app


# load the Celery application when Django starts
__all__ = ('celery_app',)