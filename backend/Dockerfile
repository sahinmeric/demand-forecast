FROM node:20-alpine

WORKDIR /app

COPY backend/package*.json ./
RUN npm install --omit=dev

COPY backend ./
RUN npx prisma generate

CMD ["node", "src/index.js"]
