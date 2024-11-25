# Base image
FROM node:23-slim

# Install system dependencies for Chromium and ffmpeg
RUN apt-get update && apt-get install -y \
    ffmpeg \
    chromium \
    curl \
    --no-install-recommends && apt-get clean && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Cache npm dependencies
COPY package*.json ./
RUN npm ci && npm cache clean --force

# RUN npm install -g prisma
RUN npm install -g prisma

# Copy Prisma schema and other application files
COPY prisma ./prisma

# Copy the rest of the application files
COPY my-video ./my-video

WORKDIR /app/my-video

RUN npm install

WORKDIR /app

# Run Prisma generate and clean up
RUN prisma generate && npm uninstall -g prisma && rm -rf /app/prisma

# Copy additional scripts
COPY exportData.js ./uploadToR2.js ./script.sh ./

# Ensure the script is executable and in Unix format
RUN chmod +x script.sh && sed -i 's/\r$//' script.sh

# Define the command to execute the script
CMD ["./script.sh"]
