# Nginx reverse proxy in front of SvelteKit Node app and backend API.
# Build context is repo root: docker compose -f compose-prod.yml build nginx
FROM nginx:alpine
COPY docker/app/prod/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
