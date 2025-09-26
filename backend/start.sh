#!/bin/bash
set -e
python3 -m pip install -r requirements.txt
python3 manage.py migrate
python3 manage.py collectstatic --noinput
gunicorn energetic-charm.wsgi:application --bind 0.0.0.0:$PORT