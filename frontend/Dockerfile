# Use an official Node image to build the app
FROM node:18 AS build

# Copy the package.json and package-lock.json into the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code into the container
COPY . .


# Expose port 300 to the outside world
EXPOSE 3000

# Start server
CMD ["npm", "start", "--", "--port", "3000"]