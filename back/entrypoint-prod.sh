echo "Checking deployment..."
python3 manage.py check --deploy

echo "Copying static files..."
python3 manage.py collectstatic --noinput

echo "Migrating..."
python3 manage.py migrate --noinput

echo "Starting gunicorn server..."

exec "$@"