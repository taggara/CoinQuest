FROM node:20-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install serve globally
RUN npm install -g serve

# Expose port 3000
EXPOSE 8099

# The entrypoint will be defined in docker-compose.yml
CMD ["serve", "-s", "web-build", "-l", "8099", "-H", "192.168.4.52"]