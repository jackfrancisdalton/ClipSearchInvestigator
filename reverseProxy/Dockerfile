FROM nginx:latest

EXPOSE 80

# Assign relevent env variables to the default.conf
CMD envsubst '$FRONTEND_INTERNAL_PORT $BACKEND_INTERNAL_PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'