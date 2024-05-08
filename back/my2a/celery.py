import os

from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "my2a.settings")

celery_app = Celery("my2a")
celery_app.config_from_object("django.conf:settings", namespace="CELERY")
celery_app.autodiscover_tasks()