FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY turbo.json ./
COPY packages/ ./packages/
COPY apps/api-gateway/package*.json ./apps/api-gateway/

# Install dependencies
RUN npm install && npm run build --workspace @gestao-tarefas/types && npm run build --workspace @gestao-tarefas/utils

# Copy source code
COPY . .

WORKDIR /app/apps/api-gateway

# Install service dependencies
RUN npm install && npm run build

# Expose port
EXPOSE 3001

# Start the service (compiled output)
CMD ["node", "dist/apps/api-gateway/src/main.js"]
