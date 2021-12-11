#!/bin/sh

python manage.py makemigrations --no-input
python manage.py migrate --no-input
python manage.py collectstatic --no-input
exec gunicorn tree.wsgi:application --bind 0.0.0.0:8000 --reload
celery -A tree worker -l INFO --pool=solo
