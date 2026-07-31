# Stage 1: Build the frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Stage 2: Build the backend and serve
FROM node:18-alpine
WORKDIR /app

# Install native dependencies for SQLite
RUN apk add --no-cache python3 make g++

# Copy backend dependencies
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install

# Copy backend source code
COPY backend/ ./

# Copy built frontend from Stage 1
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose the backend port
EXPOSE 3000

# Run the backend server
CMD ["node", "src/server.js"]
