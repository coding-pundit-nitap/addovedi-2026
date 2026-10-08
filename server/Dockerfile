# Addovedi API server — Node/Express, run behind the compose network as
# "server" so the client's nginx proxy and other containers can reach it
# by service name.
FROM node:20-alpine

WORKDIR /app

# Install dependencies first so this layer is cached across source changes.
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

COPY . .

ENV NODE_ENV=production
EXPOSE 5001

CMD ["node", "server.js"]
