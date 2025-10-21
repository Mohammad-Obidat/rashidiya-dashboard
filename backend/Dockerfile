FROM node:20-alpine

WORKDIR /app

# Copy package.json & prisma folder
COPY package*.json ./
COPY prisma ./prisma

# Set DB environment variable for Prisma generate
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

# Install deps & generate Prisma client
RUN npm install

# Copy rest of source code
COPY . .

# Build NestJS
RUN npm run build

# Run migrations on container start, then start server
CMD npx prisma migrate deploy && node dist/main.js
