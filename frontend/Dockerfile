# Use Node LTS version
FROM node:20-alpine

# Set working directory inside container
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the frontend source code
COPY . .

# Expose Vite development port
EXPOSE 5173

# Start Vite with the host flag so it's accessible outside the container
CMD ["npm", "run", "dev", "--", "--host"]