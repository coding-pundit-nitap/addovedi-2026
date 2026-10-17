# Addovedi frontend — Vite/React, built to static files and served by its
# own nginx. The top-level nginx/ container reverse-proxies to this one and
# is the only container exposed to the host.
# Vite bakes VITE_* vars into the bundle at BUILD time, not runtime, so they
# must arrive as build args (see docker-compose.yml), not just environment
# variables on the running container.

FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json* ./
# Strict peer deps on the 3D libraries (three/@react-three/*) mean a normal
# `npm ci` fails here — see README.md.
RUN npm ci --legacy-peer-deps

COPY . .

# Same-origin relative path: the top-level nginx/ proxies /api/* to the
# server container, so the client never needs to know the backend's real
# host/port and no CORS is involved for same-domain deployments.
ARG VITE_API_URL=/api
ARG VITE_TURNSTILE_SITE_KEY=
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_TURNSTILE_SITE_KEY=${VITE_TURNSTILE_SITE_KEY}

RUN npm run build

FROM nginx:1.27-alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
