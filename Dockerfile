# Use an official Node.js runtime as a parent image
FROM node:latest

# Set the working directory in the container
WORKDIR /appdata

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Copy the current directory contents into the container at /appdata
COPY . .

# Make port 8099 available to the world outside this container
EXPOSE 8099

# Define environment variable
ENV NODE_ENV=development

# Run startup.sh when the container launches
COPY startup.sh .
RUN chmod +x startup.sh
CMD ["/bin/bash", "./startup.sh"]