FROM node:14.16.0-alpine3.13 as build

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build