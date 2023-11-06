#!/bin/sh

echo "Migrating..."
python3 manage.py migrate --noinput

echo "Starting gunicorn server..."

exec "$@"