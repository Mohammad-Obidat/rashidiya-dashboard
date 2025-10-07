# Backend (NestJS + Prisma)
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose NestJS port
EXPOSE 3000

# Start in dev mode
CMD ["npm", "run", "start"]
