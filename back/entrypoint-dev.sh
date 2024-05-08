#!/bin/sh

celery -A my2a worker --loglevel=info --logfile=/var/log/celery.log --detach

echo "Migrating..."
python3 manage.py migrate --noinput

echo "Starting gunicorn server..."

exec "$@"