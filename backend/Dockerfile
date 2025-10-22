# Stage 1: Build
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine
WORKDIR /app
COPY --from=build /app ./
ENV NODE_ENV=production
# Run Prisma generate so client is ready
RUN npx prisma generate

# Start command – run migrations then start the app
CMD npx prisma migrate deploy && node dist/main.js
