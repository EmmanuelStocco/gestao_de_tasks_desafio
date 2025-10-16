FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY turbo.json ./
COPY packages/ ./packages/
COPY apps/tasks-service/package*.json ./apps/tasks-service/

# Install dependencies
RUN npm install && npm run build --workspace @gestao-tarefas/types && npm run build --workspace @gestao-tarefas/utils

# Copy source code
COPY . .

WORKDIR /app/apps/tasks-service

# Install service dependencies
RUN npm install && npm run build

# Expose port
EXPOSE 3003

# Start the service (compiled output)
CMD ["node", "dist/apps/tasks-service/src/main.js"]
