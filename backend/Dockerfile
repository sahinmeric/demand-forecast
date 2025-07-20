# Use Node base image
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy package files and install deps
COPY package*.json ./
RUN npm install --omit=dev

# Copy the rest of the backend code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose port (match backend PORT)
EXPOSE 3000

# Apply Prisma migrations and start app
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed && node src/index.js"]
