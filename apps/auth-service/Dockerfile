FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY turbo.json ./
COPY packages/ ./packages/
COPY apps/auth-service/package*.json ./apps/auth-service/

# Install dependencies
RUN npm install && npm run build --workspace @gestao-tarefas/types && npm run build --workspace @gestao-tarefas/utils

# Copy source code
COPY . .

WORKDIR /app/apps/auth-service

# Install service dependencies
RUN npm install && npm run build

# Expose port
EXPOSE 3002

# Start the service (compiled output)
CMD ["node", "dist/apps/auth-service/src/main.js"]
