#!/bin/bash
# Apply database migrations
python3 manage.py migrate

# Collect static files
python3 manage.py collectstatic --noinput

# Start the server on the Railway port
python3 manage.py runserver 0.0.0.0:$PORT