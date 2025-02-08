# Use an official Nginx image
FROM nginx:latest

# Copy the Nginx configuration

# COPY default.conf /etc/nginx/conf.d/default.conf

COPY default.conf.template /etc/nginx/conf.d/default.conf.template

# Expose port 80
EXPOSE 80

CMD envsubst '$FRONTEND_PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'

