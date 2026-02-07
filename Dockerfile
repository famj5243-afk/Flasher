FROM node:18-alpine as client-builder

WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

FROM node:18-alpine

WORKDIR /app

# Copy backend dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy server files
COPY server ./server

# Copy built frontend
COPY --from=client-builder /app/client/build ./client/build

EXPOSE 5000

ENV NODE_ENV=production

# Educational disclaimer
LABEL description="Educational Email Simulation Platform - For Learning Purposes Only"
LABEL disclaimer="This is a simulation for educational purposes only"

CMD ["node", "server/index.js"]
