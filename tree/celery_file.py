import os

from celery import Celery as Celery_app_tree
from celery.schedules import crontab

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tree.settings')

app = Celery_app_tree('tree')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django apps.
app.autodiscover_tasks()

app.conf.beat_schedule = {
    'persons_info': {
        'task': 'family_tree.tasks.persons_count',
        'schedule': crontab(minute=0, hour=7),
    }
}
