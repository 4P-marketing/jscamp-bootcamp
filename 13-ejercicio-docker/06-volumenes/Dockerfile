FROM node:22-alpine

WORKDIR /app

COPY server.js .

EXPOSE 3000

USER node

CMD ["node", "--watch", "server.js"]
