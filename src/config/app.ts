import { Hono } from "hono";
import { cors } from "hono/cors";
import { createNodeWebSocket } from "@hono/node-ws";

export const app = new Hono();

app.use("*", cors());

app.notFound(async (ctx) => {
return ctx.text("findface-bridge", 404);
});

export const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({
  app,
});
