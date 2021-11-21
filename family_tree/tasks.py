from .models import Person
from celery import shared_task


@shared_task
def persons_count():
    queryset = Person.objects.all()
    return f'Person count is {len(queryset)}'
