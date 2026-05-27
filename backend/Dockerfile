# Use Node LTS version
FROM node:20-alpine

# Set working directory inside container
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the backend source code
COPY . .

# Expose backend port
EXPOSE 5000

# Start the application
CMD ["node", "server.js"]