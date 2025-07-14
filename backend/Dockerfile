# --- Production build ---
FROM node:20 AS backend

WORKDIR /app

COPY backend/package*.json ./
RUN npm install --only=production

COPY backend .

CMD ["npm", "run", "start"]
