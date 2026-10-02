FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY prisma ./prisma
RUN npx prisma generate
COPY src ./src
COPY scripts ./scripts
COPY tests ./tests
COPY jest.config.js ./
EXPOSE ${SERVER_PORT:-3000}
CMD ["sh", "-c", "node scripts/init-database.js && npx prisma db push && npm run dev"]
