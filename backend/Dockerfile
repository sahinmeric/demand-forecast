# Use Node base image
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy package files and install deps
COPY package*.json ./
RUN npm install --omit=dev

# Copy the rest of the backend code
COPY . .

# Expose port (match backend PORT)
EXPOSE 3000

# Start server
CMD ["npm", "run", "start"]
