# Stage 1: Build
FROM node:20 AS build
WORKDIR /app

# Copy dependency files first
COPY package*.json ./

# Copy Prisma schema early so postinstall (prisma generate) works
COPY prisma ./prisma

# Install dependencies
RUN npm ci

# Copy the rest of the backend code
COPY . .

# Build NestJS
RUN npm run build

# Stage 2: Production
FROM node:20-alpine
WORKDIR /app

# Copy built app from previous stage
COPY --from=build /app ./

# Set environment variables
ENV NODE_ENV=production

# Generate Prisma client (safe even if already done)
RUN npx prisma generate

# Run migrations and start the app
CMD npx prisma migrate deploy && node dist/main.js
