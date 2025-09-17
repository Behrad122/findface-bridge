FROM oven/bun:1.2.19-alpine

WORKDIR /app

RUN apk add --no-cache curl

COPY build ./build
COPY package.json .

RUN bun install --ignore-scripts --verbose

CMD ["bun", "./build/index.mjs"]
