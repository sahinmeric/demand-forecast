# Step 1: Build the Vite app
FROM node:20 AS builder

WORKDIR /app
COPY frontend/package*.json ./
RUN npm install --legacy-peer-deps --prefer-offline --no-audit
COPY frontend .
RUN npm run build

# Step 2: Serve with NGINX
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
