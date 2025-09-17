FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache curl

COPY build ./build
COPY package.json .

RUN npm install --ignore-scripts --verbose

CMD ["node", "./build/index.mjs"]
