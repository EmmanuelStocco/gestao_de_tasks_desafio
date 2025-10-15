FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY turbo.json ./
COPY packages/ ./packages/
COPY apps/notifications-service/package*.json ./apps/notifications-service/

# Install dependencies
RUN npm install

# Copy source code
COPY . .

WORKDIR /app/apps/notifications-service

# Install service dependencies
RUN npm install

# Build the application
RUN npm run build

# Expose port
EXPOSE 3004

# Start the service
CMD ["npm", "run", "start"]
