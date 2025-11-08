FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Build frontend
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
RUN npm run build

# Back to root
WORKDIR /app

# Expose port
EXPOSE 3001

# Start server
CMD ["npm", "run", "server"]
