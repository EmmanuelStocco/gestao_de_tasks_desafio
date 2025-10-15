FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY turbo.json ./
COPY packages/ ./packages/
COPY apps/web/package*.json ./apps/web/

# Install dependencies
RUN npm install

# Copy source code
COPY . .

WORKDIR /app/apps/web

# Install service dependencies
RUN npm install

# Expose port
EXPOSE 3000

# Start the service
CMD ["npm", "run", "dev"]
