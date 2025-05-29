# Use the existing Python base image
FROM mcr.microsoft.com/devcontainers/python:1-3.12-bullseye

# Install Node.js, npm, and npx
# Install Node.js (includes npm and npx)
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs
    
# Set the working directory inside the container
WORKDIR /workspace

# Copy backend requirements into the container and install dependencies
COPY backend/requirements.txt /workspace/backend/requirements.txt
RUN pip install -r /workspace/backend/requirements.txt


# # Copy and install frontend Node dependencies TODO: consider doing this instead of volume mounting
# COPY ../frontend/package.json ./frontend/package.json
# RUN cd frontend && npm install