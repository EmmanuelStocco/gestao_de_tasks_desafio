FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY turbo.json ./
COPY packages/ ./packages/
COPY apps/api-gateway/package*.json ./apps/api-gateway/

# Install dependencies
RUN npm install

# Copy source code
COPY . .

WORKDIR /app/apps/api-gateway

# Install service dependencies
RUN npm install

# Build the application
RUN npm run build

# Expose port
EXPOSE 3001

# Start the service
CMD ["npm", "run", "start"]
