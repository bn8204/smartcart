# SmartCart Backend Dockerfile for Root Level
# This allows Render and other platforms to find and deploy the backend

FROM node:18-alpine

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

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
EXPOSE 10000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 10000), (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Use dumb-init to run node properly
ENTRYPOINT ["/sbin/dumb-init", "--"]

# Start the application
CMD ["node", "src/server.js"]
