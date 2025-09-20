import { serve } from "@hono/node-server";
import { app, injectWebSocket } from "../config/app";

import { CC_FINDFACE_BRIDGE_HOST, CC_FINDFACE_BRIDGE_PORT } from "../lib/findface/config/params";

import { createServer } from "http";

import "../routes/findface";
import "../routes/health";
import "../routes/capture";

const MAX_CONNECTIONS = 1_000;
const SOCKET_TIMEOUT = 60 * 10 * 1000;

const main = () => {

  const server = serve({
    fetch: app.fetch,
    port: CC_FINDFACE_BRIDGE_PORT,
    hostname: CC_FINDFACE_BRIDGE_HOST,
    createServer: (...args) => {
      const server = createServer(...args);
      server.maxConnections = MAX_CONNECTIONS;
      server.setTimeout(SOCKET_TIMEOUT);
      return server;
    },
  });

  server.addListener("listening", () => {
    console.log(`Server listening on http://0.0.0.0:${CC_FINDFACE_BRIDGE_PORT}`);
  });

  injectWebSocket(server);
};

main();
