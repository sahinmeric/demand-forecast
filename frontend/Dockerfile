# --- Frontend Build ---
FROM node:20 AS frontend

WORKDIR /app

COPY frontend/package*.json ./
RUN npm install

COPY frontend .
RUN npm run build

# Optional: Serve with nginx
# FROM nginx:alpine
# COPY --from=frontend /app/dist /usr/share/nginx/html
