FROM node:16-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the project (if necessary - adjust command if you have a specific build step)
RUN npm run build

# Expose port (Cloud Run automatically exposes port 8080)
EXPOSE 8080

# Start the server.  Adjust this if you need a different way to serve the files.
CMD ["npm", "start"]
