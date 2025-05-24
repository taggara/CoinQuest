FROM node:20-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install serve globally
RUN npm install -g serve

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build:web

# Expose port 3000
EXPOSE 3000

# Start the server
CMD ["serve", "-s", "web-build", "-l", "3000"]
