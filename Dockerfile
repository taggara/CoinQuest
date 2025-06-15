FROM node:18-bullseye

# Install Python and pip
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    git \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory in the container
WORKDIR /appdata

# Copy package files first for better caching
COPY package*.json ./
COPY requirements.txt ./

# Install Node.js dependencies
RUN npm install

# Install Python dependencies
RUN pip3 install -r requirements.txt

# Copy the rest of the application
COPY . .

# Create data directory
RUN mkdir -p /appdata/data

# Set environment variables
ENV NODE_ENV=development
ENV HOST=0.0.0.0
ENV PORT=8081
ENV DATABASE_URL=postgresql://admin:@192.168.4.52:5432/coinquest

# Expose port 8081
EXPOSE 8081

# Make startup script executable
RUN chmod +x startup.sh

# Run startup script
CMD ["./startup.sh"]