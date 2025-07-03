# Use official Node.js LTS image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files first (for Docker caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all other source code
COPY . .

# Build TypeScript code
RUN npm run build

# Expose the app port (match with Express server)
EXPOSE 8080

# Start the compiled JS server
CMD ["node", "./www/server.js"]
