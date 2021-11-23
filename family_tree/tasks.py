from .models import Person
from celery import shared_task
from django.core.mail import EmailMessage
from decouple import config


@shared_task
def persons_count():
    queryset = Person.objects.all()
    num_persons = len(queryset)
    send_email_address = config('SENT_EMAIL_ADDRESS')
    subject = f'Количество людей в базе'
    body = f'На текущий момент в базе {num_persons} человек'
    email = EmailMessage(subject, body, to=[send_email_address])
    email.send()
    return f'Person count is {num_persons}'
