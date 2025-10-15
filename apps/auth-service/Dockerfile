FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY turbo.json ./
COPY packages/ ./packages/
COPY apps/auth-service/package*.json ./apps/auth-service/

# Install dependencies
RUN npm install

# Copy source code
COPY . .

WORKDIR /app/apps/auth-service

# Install service dependencies
RUN npm install

# Build the application
RUN npm run build

# Expose port
EXPOSE 3002

# Start the service
CMD ["npm", "run", "start"]
