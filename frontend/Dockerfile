# Use an official Node image to build the app
FROM node:18 AS build

ARG API_DB_URL="NULL"

ENV NEXT_PUBLIC_API_DB_URL=$API_DB_URL

# Copy the package.json and package-lock.json into the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code into the container
COPY . .

#Build the app
RUN npm run build

# Expose port 300 to the outside world
EXPOSE 3000

# Start server
CMD ["npm", "start", "--", "--port", "3000"]