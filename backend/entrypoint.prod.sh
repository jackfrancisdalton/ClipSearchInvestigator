#!/bin/sh

/wait-for-it.sh database:5432 -- echo "Database is ready!"

# Apply Alembic migrations
alembic upgrade head

# Start Gunicorn with Uvicorn workers (production mode)
exec gunicorn app.main:app \
  --workers 4 \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:${PORT}