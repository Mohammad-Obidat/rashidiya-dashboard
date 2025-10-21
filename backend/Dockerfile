FROM node:20-alpine

WORKDIR /app

# Copy package.json first
COPY package*.json ./

# Copy prisma folder **before** npm install
COPY prisma ./prisma

# Install dependencies (postinstall will now find schema)
RUN npm install

# Copy rest of the source code
COPY . .

# Build NestJS
RUN npm run build

# Start the server
CMD ["node", "dist/main.js"]
