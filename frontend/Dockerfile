FROM node:14.16.0-alpine3.13 as build

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Use Nginx to serve the React app
FROM nginx:1.21.0-alpine

COPY --from=build /app/build /usr/share/nginx/html