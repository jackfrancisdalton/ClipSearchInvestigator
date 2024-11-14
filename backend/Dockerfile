# Use Python 3.11 as the base image
FROM python:3.11-slim

# Set the working directory
WORKDIR /app

# Copy requirements and install them
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY app/ /app/app/

# Expose the FastAPI port
EXPOSE 8000

# Set the entry point for the FastAPI app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]