# Build stage
FROM node:20 as builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Inject VITE_API_URL at build time
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

# Production stage with NGINX
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
