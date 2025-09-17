FROM oven/bun:1.2.19-alpine

WORKDIR /app

COPY build ./build
COPY package.json .

RUN bun install --ignore-scripts --verbose

CMD ["bun", "./build/index.mjs"]
