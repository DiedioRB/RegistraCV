FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE ${CLIENT_PORT:-8000}
CMD ["npm", "run", "dev"]

