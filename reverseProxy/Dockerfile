# Use an official Nginx image
FROM nginx:latest

# Expose port 80
EXPOSE 80

CMD envsubst '$FRONTEND_PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'

