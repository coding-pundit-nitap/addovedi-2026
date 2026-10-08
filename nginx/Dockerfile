# Top-level reverse proxy — the only container exposed to the host. Routes
# /api/* to the backend and everything else to the frontend container.
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
