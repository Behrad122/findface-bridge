import { app } from "../config/app";
import { findface } from "src/lib/findface";
import { randomString } from "functools-kit";

const CLIENT_ID = randomString();
const SERVICE_NAME = "findface-bridge";
const USER_ID = "unset";

app.get("/api/v1/screenshot/:cameraId", async (ctx) => {
  const cameraId = ctx.req.param("cameraId");
  const videoRequest = await findface.findFaceGlobalService.captureScreenshot({
    clientId: CLIENT_ID,
    serviceName: SERVICE_NAME,
    requestId: randomString(),
    userId: USER_ID,
    data: {
      cameraId: parseInt(cameraId),
    },
  });
  if ("error" in videoRequest && videoRequest.error) {
    throw new Error(videoRequest.error);
  }
  if ("data" in videoRequest) {
    return ctx.body(await videoRequest.data.arrayBuffer(), 200);
  }
  return ctx.text("Failed to create camera screenshot", 500);
});

app.get("/api/v1/video/:cameraId", async (ctx) => {
  const cameraId = ctx.req.param("cameraId");
  const videoRequest = await findface.findFaceGlobalService.captureVideo({
    clientId: CLIENT_ID,
    serviceName: SERVICE_NAME,
    requestId: randomString(),
    userId: USER_ID,
    data: {
      cameraId: parseInt(cameraId),
    },
  });
  if ("error" in videoRequest && videoRequest.error) {
    throw new Error(videoRequest.error);
  }
  if ("data" in videoRequest) {
    return ctx.body(await videoRequest.data.arrayBuffer(), 200);
  }
  return ctx.text("Failed to create camera video capture", 500);
});
