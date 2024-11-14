# Use the existing Python base image
FROM mcr.microsoft.com/devcontainers/python:1-3.12-bullseye

# Install Node.js, npm, and npx
# Install Node.js (includes npm and npx)
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs
    
# Set the working directory inside the container
WORKDIR /workspace

# Copy requirements for Python (optional, depends on your needs)
# COPY requirements.txt /workspace/
# RUN pip3 install --user -r requirements.txt

# Expose ports (if needed for your application)
EXPOSE 3000 8000