# Use the official Node.js image as the base image
FROM node:18-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

RUN apk add --no-cache bash

# Copy the wait-for-it.sh script into the Docker image
COPY wait-for-it.sh /usr/src/app/wait-for-it.sh

# Make the script executable
RUN chmod +x /usr/src/app/wait-for-it.sh

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application with wait-for-it
CMD ["sh", "-c", "./wait-for-it.sh db:3306 -- npm run start:prod"]
