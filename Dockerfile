# Use an official Node.js runtime as a parent image
FROM node:latest

# Install Python and pip
RUN apt-get update && apt-get install -y python3 python3-pip python3-venv

# Set the working directory in the container
WORKDIR /appdata

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Copy requirements.txt and install Python dependencies
COPY requirements.txt ./
RUN pip3 install -r requirements.txt

# Copy the current directory contents into the container at /appdata
COPY . .

# Make port 8081 available to the world outside this container
EXPOSE 8081

# Define environment variables
ENV NODE_ENV=development
ENV HOST=0.0.0.0
ENV PORT=8081

# Run startup.sh when the container launches
COPY startup.sh .
RUN chmod +x startup.sh
CMD ["/bin/bash", "./startup.sh"]