FROM node:16-alpine
WORKDIR /app
COPY . .
RUN npm install --prefix ./server
COPY . .
EXPOSE 3000
CMD ["node", "server/index.mjs"]