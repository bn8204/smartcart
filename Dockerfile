# SmartCart Backend Dockerfile for Root Level
# This allows Render and other platforms to find and deploy the backend

FROM node:18-alpine

WORKDIR /app

# Copy root level files
COPY package*.json ./
COPY Procfile ./

# Copy backend directory
COPY smartcart-backend ./smartcart-backend

WORKDIR /app/smartcart-backend

# Install dependencies with legacy peer deps support
RUN npm ci --prefer-offline --legacy-peer-deps && \
    npm cache clean --force

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /app

USER nodejs

# Expose port (Render will assign PORT env variable)
EXPOSE 3000

# Start the application
CMD ["node", "src/server.js"]
