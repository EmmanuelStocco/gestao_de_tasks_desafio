FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY turbo.json ./
COPY packages/ ./packages/
COPY apps/notifications-service/package*.json ./apps/notifications-service/

# Install dependencies
RUN npm install && npm run build --workspace @gestao-tarefas/types && npm run build --workspace @gestao-tarefas/utils

# Copy source code
COPY . .

WORKDIR /app/apps/notifications-service

# Install service dependencies
RUN npm install && npm run build

# Expose port
EXPOSE 3004

# Start the service (compiled output)
CMD ["node", "dist/apps/notifications-service/src/main.js"]
