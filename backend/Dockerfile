# Stage 1: Build the NestJS application
# Use a more complete Node.js image for building to ensure
# all dependencies are available for Prisma.
FROM node:20 as builder

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
# This includes Prisma CLI as a dev dependency
COPY package*.json ./
RUN npm install

# Copy the Prisma schema and then generate the Prisma client
# This step is crucial for Prisma to generate the correct client.
# The `npm install` command above already runs `prisma generate`,
# but explicitly running it ensures it's not missed.
COPY prisma ./prisma
RUN npx prisma generate

# Copy the rest of the application code
COPY . .

# Build the NestJS app
RUN npm run build

# Stage 2: Create a lightweight production image
# Use the Alpine image here to keep the final image small.
# Use a Node.js-based Alpine image to ensure Node is available.
FROM node:20-alpine

# Install OpenSSL, which is required by Prisma for Alpine images.
# This fixes the libssl.so.1.1 not found error.
RUN apk add --no-cache openssl

# Set the working directory
WORKDIR /app

# Copy the production dependencies and build artifacts from the builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Copy the Prisma engine binary
# This step is important for Alpine images
# The Prisma engines are downloaded during `prisma generate`
# and must be copied over.
COPY --from=builder /app/node_modules/@prisma/engines ./node_modules/@prisma/engines

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["node", "dist/main.js"]
