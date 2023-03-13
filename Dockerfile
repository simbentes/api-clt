# Use the official Node.js runtime as a parent image
FROM node:14-alpine

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies in the container
RUN npm install --production

# Copy the rest of the app's source code to the container
COPY . .

# Expose port 3000 to the host machine
EXPOSE 3000

# Start the app when the container is run
CMD ["npm", "start"]