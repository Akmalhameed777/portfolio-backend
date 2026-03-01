FROM node:18-alpine

# Set working directory
WORKDIR /opt/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Build admin panel
RUN npm run build

# Expose port
EXPOSE 1337

# Start application
CMD ["npm", "run", "develop"]
