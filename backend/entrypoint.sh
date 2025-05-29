#!/bin/sh
# Optionally wait for the database service to be available
/wait-for-it.sh database:5432 -- echo "Database is ready!"

# Apply Alembic migrations
alembic upgrade head

# Start the FastAPI server
uvicorn app.main:app --host 0.0.0.0 --port ${PORT} --reload

