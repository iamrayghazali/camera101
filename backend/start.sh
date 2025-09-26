#!/bin/bash
python3 manage.py migrate
python3 manage.py collectstatic --noinput
gunicorn project_name.wsgi:application --bind 0.0.0.0:$PORT