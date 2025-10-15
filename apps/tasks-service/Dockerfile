FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY turbo.json ./
COPY packages/ ./packages/
COPY apps/tasks-service/package*.json ./apps/tasks-service/

# Install dependencies
RUN npm install

# Copy source code
COPY . .

WORKDIR /app/apps/tasks-service

# Install service dependencies
RUN npm install

# Build the application
RUN npm run build

# Expose port
EXPOSE 3003

# Start the service
CMD ["npm", "run", "start"]
