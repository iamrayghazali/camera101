#!/bin/bash
python3 manage.py migrate
python3 manage.py collectstatic --noinput
gunicorn camera101.wsgi:application --bind 0.0.0.0:$PORT