import { minio } from "../lib/minio";
import { findface } from "../lib/findface";
import { errorData } from "functools-kit";
import { app } from "../config/app";
import { createLogger } from "pinolog";
import {
  AddHumanCardAttachmentRequest,
  CaptureScreenshotRequest,
  CreateFaceRequest,
  CreateHumanCardRequest,
  DetectFaceRequest,
  DetectLicensePlateRequest,
  EventFaceByCardIdRequest,
  EventFaceRequest,
  FindByCardIdRequest,
  FindByDetectionRequest,
  ListFaceRequest,
  RemoveFaceRequest,
  UpdateHumanCardRequest,
  VerifyFaceRequest,
} from "../model/FindFace.model";
import { omit } from "lodash-es";
import getErrorMessage from "../utils/getErrorMessage";

const logger = createLogger("findface_http.log");

app.post("/api/v1/findface/detectFace", async (ctx) => {
  const request = await ctx.req.json<DetectFaceRequest>();
  console.time(`/api/v1/findface/detectFace ${request.requestId}`);
  logger.log("/api/v1/findface/detectFace", {
    request: omit(request, "data.imageBase64"),
  });
  try {
    const result = await findface.findFaceGlobalService.detectFace({
      ...request,
      data: {
        imageId: await minio.imageDataGlobalService.putObject(
          request.data.imageBase64,
          request.data.imageName,
          {
            clientId: request.clientId,
            requestId: request.requestId,
            serviceName: request.serviceName,
            userId: request.userId,
          }
        ),
      },
    });
    logger.log("/api/v1/findface/detectFace ok", {
      request: omit(request, "data.imageBase64"),
      result,
    });
    if ("error" in result) {
      throw new Error(result.error);
    }
    return ctx.json(result, 200);
  } catch (error) {
    logger.log("/api/v1/findface/detectFace error", {
      request: omit(request, "data.imageBase64"),
      error: errorData(error),
    });
    return ctx.json(
      {
        status: "error",
        error: getErrorMessage(error),
        clientId: request.clientId,
        requestId: request.requestId,
        serviceName: request.serviceName,
        userId: request.userId,
      },
      500
    );
  } finally {
    console.timeEnd(`/api/v1/findface/detectFace ${request.requestId}`);
  }
});

app.post("/api/v1/findface/detectLicensePlate", async (ctx) => {
  const request = await ctx.req.json<DetectLicensePlateRequest>();
  console.time(`/api/v1/findface/detectLicensePlate ${request.requestId}`);
  logger.log("/api/v1/findface/detectLicensePlate", {
    request: omit(request, "data.imageBase64"),
  });
  try {
    const result = await findface.findFaceGlobalService.detectLicensePlate({
      ...request,
      data: {
        imageId: await minio.imageDataGlobalService.putObject(
          request.data.imageBase64,
          request.data.imageName,
          {
            clientId: request.clientId,
            requestId: request.requestId,
            serviceName: request.serviceName,
            userId: request.userId,
          }
        ),
      },
    });
    logger.log("/api/v1/findface/detectLicensePlate ok", {
      request: omit(request, "data.imageBase64"),
      result,
    });
    if ("error" in result) {
      throw new Error(result.error);
    }
    return ctx.json(result, 200);
  } catch (error) {
    logger.log("/api/v1/findface/detectLicensePlate error", {
      request: omit(request, "data.imageBase64"),
      error: errorData(error),
    });
    return ctx.json(
      {
        status: "error",
        error: getErrorMessage(error),
        clientId: request.clientId,
        requestId: request.requestId,
        serviceName: request.serviceName,
        userId: request.userId,
      },
      500
    );
  } finally {
    console.timeEnd(`/api/v1/findface/detectLicensePlate ${request.requestId}`);
  }
});

app.post("/api/v1/findface/verifyFace", async (ctx) => {
  const request = await ctx.req.json<VerifyFaceRequest>();
  console.time(`/api/v1/findface/verifyFace ${request.requestId}`);
  logger.log("/api/v1/findface/verifyFace", { request });
  try {
    const result = await findface.findFaceGlobalService.verifyFace(request);
    logger.log("/api/v1/findface/verifyFace ok", { request, result });
    if ("error" in result) {
      throw new Error(result.error);
    }
    return ctx.json(result, 200);
  } catch (error) {
    logger.log("/api/v1/findface/verifyFace error", {
      request,
      error: errorData(error),
    });
    return ctx.json(
      {
        status: "error",
        error: getErrorMessage(error),
        clientId: request.clientId,
        requestId: request.requestId,
        serviceName: request.serviceName,
        userId: request.userId,
      },
      500
    );
  } finally {
    console.timeEnd(`/api/v1/findface/verifyFace ${request.requestId}`);
  }
});

app.post("/api/v1/findface/createFace", async (ctx) => {
  const request = await ctx.req.json<CreateFaceRequest>();
  console.time(`/api/v1/findface/createFace ${request.requestId}`);
  logger.log("/api/v1/findface/createFace", {
    request: omit(request, "data.imageBase64"),
  });
  try {
    const result = await findface.findFaceGlobalService.createFace({
      ...request,
      data: {
        cardId: request.data.cardId,
        imageId: await minio.imageDataGlobalService.putObject(
          request.data.imageBase64,
          request.data.imageName,
          {
            clientId: request.clientId,
            requestId: request.requestId,
            serviceName: request.serviceName,
            userId: request.userId,
          }
        ),
      },
    });
    logger.log("/api/v1/findface/createFace ok", {
      request: omit(request, "data.imageBase64"),
      result,
    });
    if ("error" in result) {
      throw new Error(result.error);
    }
    return ctx.json(result, 200);
  } catch (error) {
    logger.log("/api/v1/findface/createFace error", {
      request: omit(request, "data.imageBase64"),
      error: errorData(error),
    });
    return ctx.json(
      {
        status: "error",
        error: getErrorMessage(error),
        clientId: request.clientId,
        requestId: request.requestId,
        serviceName: request.serviceName,
        userId: request.userId,
      },
      500
    );
  } finally {
    console.timeEnd(`/api/v1/findface/createFace ${request.requestId}`);
  }
});

app.post("/api/v1/findface/listFace", async (ctx) => {
  const request = await ctx.req.json<ListFaceRequest>();
  console.time(`/api/v1/findface/listFace ${request.requestId}`);
  logger.log("/api/v1/findface/listFace", { request });
  try {
    const result = await findface.findFaceGlobalService.listFace(request);
    logger.log("/api/v1/findface/listFace ok", { request, result });
    if ("error" in result) {
      throw new Error(result.error);
    }
    return ctx.json(result, 200);
  } catch (error) {
    logger.log("/api/v1/findface/listFace error", {
      request,
      error: errorData(error),
    });
    return ctx.json(
      {
        status: "error",
        error: getErrorMessage(error),
        clientId: request.clientId,
        requestId: request.requestId,
        serviceName: request.serviceName,
        userId: request.userId,
      },
      500
    );
  } finally {
    console.timeEnd(`/api/v1/findface/listFace ${request.requestId}`);
  }
});

app.post("/api/v1/findface/removeFace", async (ctx) => {
  const request = await ctx.req.json<RemoveFaceRequest>();
  console.time(`/api/v1/findface/removeFace ${request.requestId}`);
  logger.log("/api/v1/findface/removeFace", { request });
  try {
    const result = await findface.findFaceGlobalService.removeFace(request);
    logger.log("/api/v1/findface/removeFace ok", { request, result });
    if ("error" in result) {
      throw new Error(result.error);
    }
    return ctx.json(result, 200);
  } catch (error) {
    logger.log("/api/v1/findface/removeFace error", {
      request,
      error: errorData(error),
    });
    return ctx.json(
      {
        status: "error",
        error: getErrorMessage(error),
        clientId: request.clientId,
        requestId: request.requestId,
        serviceName: request.serviceName,
        userId: request.userId,
      },
      500
    );
  } finally {
    console.timeEnd(`/api/v1/findface/removeFace ${request.requestId}`);
  }
});

app.post("/api/v1/findface/findByDetection", async (ctx) => {
  const request = await ctx.req.json<FindByDetectionRequest>();
  console.time(`/api/v1/findface/findByDetection ${request.requestId}`);
  logger.log("/api/v1/findface/findByDetection", { request });
  try {
    const result = await findface.findFaceGlobalService.findByDetection(request);
    logger.log("/api/v1/findface/findByDetection ok", { request, result });
    if ("error" in result) {
      throw new Error(result.error);
    }
    return ctx.json(result, 200);
  } catch (error) {
    logger.log("/api/v1/findface/findByDetection error", {
      request,
      error: errorData(error),
    });
    return ctx.json(
      {
        status: "error",
        error: getErrorMessage(error),
        clientId: request.clientId,
        requestId: request.requestId,
        serviceName: request.serviceName,
        userId: request.userId,
      },
      500
    );
  } finally {
    console.timeEnd(`/api/v1/findface/findByDetection ${request.requestId}`);
  }
});

app.post("/api/v1/findface/findByCardId", async (ctx) => {
  const request = await ctx.req.json<FindByCardIdRequest>();
  console.time(`/api/v1/findface/findByCardId ${request.requestId}`);
  logger.log("/api/v1/findface/findByCardId", { request });
  try {
    const result = await findface.findFaceGlobalService.findByCardId(request);
    logger.log("/api/v1/findface/findByCardId ok", { request, result });
    if ("error" in result) {
      throw new Error(result.error);
    }
    return ctx.json(result, 200);
  } catch (error) {
    logger.log("/api/v1/findface/findByCardId error", {
      request,
      error: errorData(error),
    });
    return ctx.json(
      {
        status: "error",
        error: getErrorMessage(error),
        clientId: request.clientId,
        requestId: request.requestId,
        serviceName: request.serviceName,
        userId: request.userId,
      },
      500
    );
  } finally {
    console.timeEnd(`/api/v1/findface/findByCardId ${request.requestId}`);
  }
});

app.post("/api/v1/findface/createHumanCard", async (ctx) => {
  const request = await ctx.req.json<CreateHumanCardRequest>();
  console.time(`/api/v1/findface/createHumanCard ${request.requestId}`);
  logger.log("/api/v1/findface/createHumanCard", { request });
  try {
    const result = await findface.findFaceGlobalService.createHumanCard(request);
    logger.log("/api/v1/findface/createHumanCard ok", { request, result });
    if ("error" in result) {
      throw new Error(result.error);
    }
    return ctx.json(result, 200);
  } catch (error) {
    logger.log("/api/v1/findface/createHumanCard error", {
      request,
      error: errorData(error),
    });
    return ctx.json(
      {
        status: "error",
        error: getErrorMessage(error),
        clientId: request.clientId,
        requestId: request.requestId,
        serviceName: request.serviceName,
        userId: request.userId,
      },
      500
    );
  } finally {
    console.timeEnd(`/api/v1/findface/createHumanCard ${request.requestId}`);
  }
});

app.post("/api/v1/findface/updateHumanCard", async (ctx) => {
  const request = await ctx.req.json<UpdateHumanCardRequest>();
  console.time(`/api/v1/findface/updateHumanCard ${request.requestId}`);
  logger.log("/api/v1/findface/updateHumanCard", { request });
  try {
    const result = await findface.findFaceGlobalService.updateHumanCard(request);
    logger.log("/api/v1/findface/updateHumanCard ok", { request, result });
    if ("error" in result) {
      throw new Error(result.error);
    }
    return ctx.json(result, 200);
  } catch (error) {
    logger.log("/api/v1/findface/updateHumanCard error", {
      request,
      error: errorData(error),
    });
    return ctx.json(
      {
        status: "error",
        error: getErrorMessage(error),
        clientId: request.clientId,
        requestId: request.requestId,
        serviceName: request.serviceName,
        userId: request.userId,
      },
      500
    );
  } finally {
    console.timeEnd(`/api/v1/findface/updateHumanCard ${request.requestId}`);
  }
});

app.post("/api/v1/findface/eventFace", async (ctx) => {
  const request = await ctx.req.json<EventFaceRequest>();
  console.time(`/api/v1/findface/eventFace ${request.requestId}`);
  logger.log("/api/v1/findface/eventFace", {
    request: omit(request, "data.imageBase64"),
  });
  try {
    const result = await findface.findFaceGlobalService.eventFace({
      ...request,
      data: {
        imageId: await minio.imageDataGlobalService.putObject(
          request.data.imageBase64,
          request.data.imageName,
          {
            clientId: request.clientId,
            requestId: request.requestId,
            serviceName: request.serviceName,
            userId: request.userId,
          }
        ),
      },
    });
    logger.log("/api/v1/findface/eventFace ok", {
      request: omit(request, "data.imageBase64"),
      result,
    });
    if ("error" in result) {
      throw new Error(result.error);
    }
    return ctx.json(result, 200);
  } catch (error) {
    logger.log("/api/v1/findface/eventFace error", {
      request: omit(request, "data.imageBase64"),
      error: errorData(error),
    });
    return ctx.json(
      {
        status: "error",
        error: getErrorMessage(error),
        clientId: request.clientId,
        requestId: request.requestId,
        serviceName: request.serviceName,
        userId: request.userId,
      },
      500
    );
  } finally {
    console.timeEnd(`/api/v1/findface/eventFace ${request.requestId}`);
  }
});

app.post("/api/v1/findface/eventFaceByCardId", async (ctx) => {
  const request = await ctx.req.json<EventFaceByCardIdRequest>();
  console.time(`/api/v1/findface/eventFaceByCardId ${request.requestId}`);
  logger.log("/api/v1/findface/eventFaceByCardId", { request });
  try {
    const result = await findface.findFaceGlobalService.eventFaceByCardId(request);
    logger.log("/api/v1/findface/eventFaceByCardId ok", { request, result });
    if ("error" in result) {
      throw new Error(result.error);
    }
    return ctx.json(result, 200);
  } catch (error) {
    logger.log("/api/v1/findface/eventFaceByCardId error", {
      request,
      error: errorData(error),
    });
    return ctx.json(
      {
        status: "error",
        error: getErrorMessage(error),
        clientId: request.clientId,
        requestId: request.requestId,
        serviceName: request.serviceName,
        userId: request.userId,
      },
      500
    );
  } finally {
    console.timeEnd(`/api/v1/findface/eventFaceByCardId ${request.requestId}`);
  }
});

app.post("/api/v1/findface/addHumanCardAttachment", async (ctx) => {
  const request = await ctx.req.json<AddHumanCardAttachmentRequest>();
  console.time(`/api/v1/findface/addHumanCardAttachment ${request.requestId}`);
  logger.log("/api/v1/findface/addHumanCardAttachment", {
    request: omit(request, "data.imageBase64"),
  });
  try {
    const result = await findface.findFaceGlobalService.addHumanCardAttachment({
      ...request,
      data: {
        id: request.data.id,
        imageId: await minio.imageDataGlobalService.putObject(
          request.data.imageBase64,
          request.data.imageName,
          {
            clientId: request.clientId,
            requestId: request.requestId,
            serviceName: request.serviceName,
            userId: request.userId,
          }
        ),
      },
    });
    logger.log("/api/v1/findface/addHumanCardAttachment ok", {
      request: omit(request, "data.imageBase64"),
      result,
    });
    if ("error" in result) {
      throw new Error(result.error);
    }
    return ctx.json(result, 200);
  } catch (error) {
    logger.log("/api/v1/findface/addHumanCardAttachment error", {
      request: omit(request, "data.imageBase64"),
      error: errorData(error),
    });
    return ctx.json(
      {
        status: "error",
        error: getErrorMessage(error),
        clientId: request.clientId,
        requestId: request.requestId,
        serviceName: request.serviceName,
        userId: request.userId,
      },
      500
    );
  } finally {
    console.timeEnd(
      `/api/v1/findface/addHumanCardAttachment ${request.requestId}`
    );
  }
});

app.post("/api/v1/findface/captureScreenshot", async (ctx) => {
  const request = await ctx.req.json<CaptureScreenshotRequest>();
  console.time(`/api/v1/findface/captureScreenshot ${request.requestId}`);
  logger.log("/api/v1/findface/captureScreenshot", { request });
  try {
    const result = await findface.findFaceGlobalService.captureScreenshot(request);
    logger.log("/api/v1/findface/captureScreenshot ok", { request, result });
    if ("error" in result) {
      throw new Error(result.error);
    }
    const imageBuffer = await result.data.arrayBuffer();
    const imageBase64 = Buffer.from(imageBuffer).toString('base64');
    return ctx.json({
      ...result,
      data: {
        imageBase64,
        contentType: result.data.type || 'image/jpeg'
      }
    }, 200);
  } catch (error) {
    logger.log("/api/v1/findface/captureScreenshot error", {
      request,
      error: errorData(error),
    });
    return ctx.json(
      {
        status: "error",
        error: getErrorMessage(error),
        clientId: request.clientId,
        requestId: request.requestId,
        serviceName: request.serviceName,
        userId: request.userId,
      },
      500
    );
  } finally {
    console.timeEnd(`/api/v1/findface/captureScreenshot ${request.requestId}`);
  }
});
