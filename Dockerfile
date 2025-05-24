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
EXPOSE 3000

# The entrypoint will be defined in docker-compose.yml
CMD ["serve", "-s", "web-build", "-l", "3000"]