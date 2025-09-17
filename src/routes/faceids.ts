import { minio } from "../lib/minio";
import { faceids } from "../lib/faceids";
import { errorData } from "functools-kit";
import { app } from "../config/app";
import { createLogger } from "pinolog";
import {
  AddHumanCardAttachmentRequest,
  CreateFaceRequest,
  CreateHumanCardRequest,
  DetectFaceRequest,
  EventFaceByCardIdRequest,
  EventFaceRequest,
  FindByCardIdRequest,
  FindByDetectionRequest,
  ListFaceRequest,
  RemoveFaceRequest,
  UpdateHumanCardRequest,
  VerifyFaceRequest,
} from "../model/Faceids.model";
import { omit } from "lodash-es";
import getErrorMessage from "../utils/getErrorMessage";

const logger = createLogger("faceids_http.log");

app.post("/api/v1/faceids/detectFace", async (ctx) => {
  const request = await ctx.req.json<DetectFaceRequest>();
  console.time(`/api/v1/faceids/detectFace ${request.requestId}`);
  logger.log("/api/v1/faceids/detectFace", {
    request: omit(request, "data.imageBase64"),
  });
  try {
    const result = await faceids.faceIdsGlobalService.detectFace({
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
    logger.log("/api/v1/faceids/detectFace ok", {
      request: omit(request, "data.imageBase64"),
      result,
    });
    if ("error" in result) {
      throw new Error(result.error);
    }
    return ctx.json(result, 200);
  } catch (error) {
    logger.log("/api/v1/faceids/detectFace error", {
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
    console.timeEnd(`/api/v1/faceids/detectFace ${request.requestId}`);
  }
});

app.post("/api/v1/faceids/verifyFace", async (ctx) => {
  const request = await ctx.req.json<VerifyFaceRequest>();
  console.time(`/api/v1/faceids/verifyFace ${request.requestId}`);
  logger.log("/api/v1/faceids/verifyFace", { request });
  try {
    const result = await faceids.faceIdsGlobalService.verifyFace(request);
    logger.log("/api/v1/faceids/verifyFace ok", { request, result });
    if ("error" in result) {
      throw new Error(result.error);
    }
    return ctx.json(result, 200);
  } catch (error) {
    logger.log("/api/v1/faceids/verifyFace error", {
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
    console.timeEnd(`/api/v1/faceids/verifyFace ${request.requestId}`);
  }
});

app.post("/api/v1/faceids/createFace", async (ctx) => {
  const request = await ctx.req.json<CreateFaceRequest>();
  console.time(`/api/v1/faceids/createFace ${request.requestId}`);
  logger.log("/api/v1/faceids/createFace", {
    request: omit(request, "data.imageBase64"),
  });
  try {
    const result = await faceids.faceIdsGlobalService.createFace({
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
    logger.log("/api/v1/faceids/createFace ok", {
      request: omit(request, "data.imageBase64"),
      result,
    });
    if ("error" in result) {
      throw new Error(result.error);
    }
    return ctx.json(result, 200);
  } catch (error) {
    logger.log("/api/v1/faceids/createFace error", {
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
    console.timeEnd(`/api/v1/faceids/createFace ${request.requestId}`);
  }
});

app.post("/api/v1/faceids/listFace", async (ctx) => {
  const request = await ctx.req.json<ListFaceRequest>();
  console.time(`/api/v1/faceids/listFace ${request.requestId}`);
  logger.log("/api/v1/faceids/listFace", { request });
  try {
    const result = await faceids.faceIdsGlobalService.listFace(request);
    logger.log("/api/v1/faceids/listFace ok", { request, result });
    if ("error" in result) {
      throw new Error(result.error);
    }
    return ctx.json(result, 200);
  } catch (error) {
    logger.log("/api/v1/faceids/listFace error", {
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
    console.timeEnd(`/api/v1/faceids/listFace ${request.requestId}`);
  }
});

app.post("/api/v1/faceids/removeFace", async (ctx) => {
  const request = await ctx.req.json<RemoveFaceRequest>();
  console.time(`/api/v1/faceids/removeFace ${request.requestId}`);
  logger.log("/api/v1/faceids/removeFace", { request });
  try {
    const result = await faceids.faceIdsGlobalService.removeFace(request);
    logger.log("/api/v1/faceids/removeFace ok", { request, result });
    if ("error" in result) {
      throw new Error(result.error);
    }
    return ctx.json(result, 200);
  } catch (error) {
    logger.log("/api/v1/faceids/removeFace error", {
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
    console.timeEnd(`/api/v1/faceids/removeFace ${request.requestId}`);
  }
});

app.post("/api/v1/faceids/findByDetection", async (ctx) => {
  const request = await ctx.req.json<FindByDetectionRequest>();
  console.time(`/api/v1/faceids/findByDetection ${request.requestId}`);
  logger.log("/api/v1/faceids/findByDetection", { request });
  try {
    const result = await faceids.faceIdsGlobalService.findByDetection(request);
    logger.log("/api/v1/faceids/findByDetection ok", { request, result });
    if ("error" in result) {
      throw new Error(result.error);
    }
    return ctx.json(result, 200);
  } catch (error) {
    logger.log("/api/v1/faceids/findByDetection error", {
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
    console.timeEnd(`/api/v1/faceids/findByDetection ${request.requestId}`);
  }
});

app.post("/api/v1/faceids/findByCardId", async (ctx) => {
  const request = await ctx.req.json<FindByCardIdRequest>();
  console.time(`/api/v1/faceids/findByCardId ${request.requestId}`);
  logger.log("/api/v1/faceids/findByCardId", { request });
  try {
    const result = await faceids.faceIdsGlobalService.findByCardId(request);
    logger.log("/api/v1/faceids/findByCardId ok", { request, result });
    if ("error" in result) {
      throw new Error(result.error);
    }
    return ctx.json(result, 200);
  } catch (error) {
    logger.log("/api/v1/faceids/findByCardId error", {
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
    console.timeEnd(`/api/v1/faceids/findByCardId ${request.requestId}`);
  }
});

app.post("/api/v1/faceids/createHumanCard", async (ctx) => {
  const request = await ctx.req.json<CreateHumanCardRequest>();
  console.time(`/api/v1/faceids/createHumanCard ${request.requestId}`);
  logger.log("/api/v1/faceids/createHumanCard", { request });
  try {
    const result = await faceids.faceIdsGlobalService.createHumanCard(request);
    logger.log("/api/v1/faceids/createHumanCard ok", { request, result });
    if ("error" in result) {
      throw new Error(result.error);
    }
    return ctx.json(result, 200);
  } catch (error) {
    logger.log("/api/v1/faceids/createHumanCard error", {
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
    console.timeEnd(`/api/v1/faceids/createHumanCard ${request.requestId}`);
  }
});

app.post("/api/v1/faceids/updateHumanCard", async (ctx) => {
  const request = await ctx.req.json<UpdateHumanCardRequest>();
  console.time(`/api/v1/faceids/updateHumanCard ${request.requestId}`);
  logger.log("/api/v1/faceids/updateHumanCard", { request });
  try {
    const result = await faceids.faceIdsGlobalService.updateHumanCard(request);
    logger.log("/api/v1/faceids/updateHumanCard ok", { request, result });
    if ("error" in result) {
      throw new Error(result.error);
    }
    return ctx.json(result, 200);
  } catch (error) {
    logger.log("/api/v1/faceids/updateHumanCard error", {
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
    console.timeEnd(`/api/v1/faceids/updateHumanCard ${request.requestId}`);
  }
});

app.post("/api/v1/faceids/eventFace", async (ctx) => {
  const request = await ctx.req.json<EventFaceRequest>();
  console.time(`/api/v1/faceids/eventFace ${request.requestId}`);
  logger.log("/api/v1/faceids/eventFace", {
    request: omit(request, "data.imageBase64"),
  });
  try {
    const result = await faceids.faceIdsGlobalService.eventFace({
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
    logger.log("/api/v1/faceids/eventFace ok", {
      request: omit(request, "data.imageBase64"),
      result,
    });
    if ("error" in result) {
      throw new Error(result.error);
    }
    return ctx.json(result, 200);
  } catch (error) {
    logger.log("/api/v1/faceids/eventFace error", {
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
    console.timeEnd(`/api/v1/faceids/eventFace ${request.requestId}`);
  }
});

app.post("/api/v1/faceids/eventFaceByCardId", async (ctx) => {
  const request = await ctx.req.json<EventFaceByCardIdRequest>();
  console.time(`/api/v1/faceids/eventFaceByCardId ${request.requestId}`);
  logger.log("/api/v1/faceids/eventFaceByCardId", { request });
  try {
    const result = await faceids.faceIdsGlobalService.eventFaceByCardId(request);
    logger.log("/api/v1/faceids/eventFaceByCardId ok", { request, result });
    if ("error" in result) {
      throw new Error(result.error);
    }
    return ctx.json(result, 200);
  } catch (error) {
    logger.log("/api/v1/faceids/eventFaceByCardId error", {
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
    console.timeEnd(`/api/v1/faceids/eventFaceByCardId ${request.requestId}`);
  }
});

app.post("/api/v1/faceids/addHumanCardAttachment", async (ctx) => {
  const request = await ctx.req.json<AddHumanCardAttachmentRequest>();
  console.time(`/api/v1/faceids/addHumanCardAttachment ${request.requestId}`);
  logger.log("/api/v1/faceids/addHumanCardAttachment", {
    request: omit(request, "data.imageBase64"),
  });
  try {
    const result = await faceids.faceIdsGlobalService.addHumanCardAttachment({
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
    logger.log("/api/v1/faceids/addHumanCardAttachment ok", {
      request: omit(request, "data.imageBase64"),
      result,
    });
    if ("error" in result) {
      throw new Error(result.error);
    }
    return ctx.json(result, 200);
  } catch (error) {
    logger.log("/api/v1/faceids/addHumanCardAttachment error", {
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
      `/api/v1/faceids/addHumanCardAttachment ${request.requestId}`
    );
  }
});
