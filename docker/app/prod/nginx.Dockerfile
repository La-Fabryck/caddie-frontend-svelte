# Nginx reverse proxy in front of SvelteKit Node app and backend API.
# Build context is repo root: docker compose -f compose.yml build nginx
FROM nginx:1.31.8-alpine
COPY docker/app/prod/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
