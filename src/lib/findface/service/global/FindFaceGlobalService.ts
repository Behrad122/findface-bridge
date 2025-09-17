import { inject } from "../../core/di";
import LoggerService from "../base/LoggerService";
import TYPES from "../../config/types";
import {
  CANCELED_PROMISE_SYMBOL,
  singleshot,
  TResponse,
  getErrorMessage,
  errorData,
} from "functools-kit";
import {
  ContextService,
  IContext,
} from "../base/ContextService";
import AuthService from "../base/AuthService";
import {
  CC_ENABLE_TERMINATE_SESSIONS,
  CC_FINDFACE_PASSWORD,
  CC_FINDFACE_USER,
} from "../../config/params";
import DetectPublicService, {
  TDetectPublicService,
} from "../public/DetectPublicService";
import { IFaceDetect } from "../../model/FaceDetect.model";
import IFaceVerify from "../../model/FaceVerify.model";
import IFaceEvent from "../../model/FaceEvent.model";
import FacePublicService, {
  TFacePublicService,
} from "../public/FacePublicService";
import { IFace } from "../../model/Face.model";
import {
  CardPublicService,
  TCardPublicService,
} from "../public/CardPublicService";
import CapturePublicService, {
  TCapturePublicService,
} from "../public/CapturePublicService";
import {
  IHumanCardDto,
  IHumanCardRow,
} from "../../model/HumanCard.model";
import { IAttachment } from "../../model/Attachment.model";
import IDetectVerify from "../../model/DetectVerify.model";
import { ILicensePlaceDetect } from "../../model/LicensePlateDetect.model";

interface TRequest<T extends object>
  extends Omit<
    IContext,
    keyof {
      token: never;
    }
  > {
  data: T;
}

export class ListenerService
  implements TDetectPublicService, TFacePublicService, TCardPublicService, TCapturePublicService
{
  protected readonly loggerService = inject<LoggerService>(TYPES.loggerService);
  protected readonly authService = inject<AuthService>(TYPES.authService);

  protected readonly cardPublicService = inject<CardPublicService>(
    TYPES.cardPublicService
  );
  protected readonly detectPublicService = inject<DetectPublicService>(
    TYPES.detectPublicService
  );
  protected readonly facePublicService = inject<FacePublicService>(
    TYPES.facePublicService
  );
  protected readonly capturePublicService = inject<CapturePublicService>(
    TYPES.capturePublicService
  );

  private getToken = singleshot(
    async (context: {
      clientId: string;
      requestId: string;
      serviceName: string;
      userId: string;
    }) => {
      this.loggerService.log("findFaceGlobalService getToken", context);
      try {
        const token = await this.authService.login(
          CC_FINDFACE_USER,
          CC_FINDFACE_PASSWORD,
          context
        );
        this.loggerService.log("findFaceGlobalService getToken login ok", context);
        if (CC_ENABLE_TERMINATE_SESSIONS) {
          await this.authService.terminateOfflineSessions(token, context);
          this.loggerService.log(
            "findFaceGlobalService terminateOfflineSessions ok",
            context
          );
        }
        return token;
      } catch (error: any) {
        if (error?.statusCode === 401 || error?.statusCode === 403) {
          this.loggerService.log("findFaceGlobalService getToken login 401", context);
        }
        this.getToken.clear();
        throw error;
      }
    }
  );

  public detectFace = async (request: TRequest<{ imageId: string }>) => {
    this.loggerService.log("findFaceGlobalService detectFace", { request });
    return await ContextService.runInContext(
      async (): Promise<TResponse<IFaceDetect[]>> => {
        try {
          const data = await this.detectPublicService.detectFace(
            request.data.imageId
          );
          if (data === CANCELED_PROMISE_SYMBOL) {
            throw new Error("request canceled");
          }
          this.loggerService.log("findFaceGlobalService detectFace ok", {
            request,
            data,
          });
          return {
            status: "ok",
            serviceName: request.serviceName,
            clientId: request.clientId,
            userId: request.userId,
            requestId: request.requestId,
            data,
          };
        } catch (error: any) {
          if (error?.statusCode === 401 || error?.statusCode === 403) {
            this.loggerService.log("findFaceGlobalService detectFace 401", {
              request,
            });
            this.getToken.clear();
            return await this.detectFace(request);
          }
          this.loggerService.log("findFaceGlobalService detectFace error", {
            request,
            error: errorData(error),
          });
          return {
            status: "error",
            error: getErrorMessage(error),
            clientId: request.clientId,
            requestId: request.requestId,
            serviceName: request.serviceName,
            userId: request.userId,
          };
        }
      },
      {
        clientId: request.clientId,
        serviceName: request.serviceName,
        requestId: request.userId,
        userId: request.userId,
        token: await this.getToken({
          clientId: request.clientId,
          requestId: request.requestId,
          serviceName: request.serviceName,
          userId: request.userId,
        }),
      }
    );
  };

  public detectFaceByBlob = async (request: TRequest<{ blob: Blob }>) => {
    this.loggerService.log("findFaceGlobalService detectFaceByBlob", { request });
    return await ContextService.runInContext(
      async (): Promise<TResponse<IFaceDetect[]>> => {
        try {
          const data = await this.detectPublicService.detectFaceByBlob(
            request.data.blob
          );
          if (data === CANCELED_PROMISE_SYMBOL) {
            throw new Error("request canceled");
          }
          this.loggerService.log("findFaceGlobalService detectFaceByBlob ok", {
            request,
            data,
          });
          return {
            status: "ok",
            serviceName: request.serviceName,
            clientId: request.clientId,
            userId: request.userId,
            requestId: request.requestId,
            data,
          };
        } catch (error: any) {
          if (error?.statusCode === 401 || error?.statusCode === 403) {
            this.loggerService.log("findFaceGlobalService detectFaceByBlob 401", {
              request,
            });
            this.getToken.clear();
            return await this.detectFaceByBlob(request);
          }
          this.loggerService.log("findFaceGlobalService detectFaceByBlob error", {
            request,
            error: errorData(error),
          });
          return {
            status: "error",
            error: getErrorMessage(error),
            clientId: request.clientId,
            requestId: request.requestId,
            serviceName: request.serviceName,
            userId: request.userId,
          };
        }
      },
      {
        clientId: request.clientId,
        serviceName: request.serviceName,
        requestId: request.userId,
        userId: request.userId,
        token: await this.getToken({
          clientId: request.clientId,
          requestId: request.requestId,
          serviceName: request.serviceName,
          userId: request.userId,
        }),
      }
    );
  };

  public verifyFace = async (
    request: TRequest<{ cardId: string; detectionId: string }>
  ) => {
    this.loggerService.log("findFaceGlobalService verifyFace", { request });
    return await ContextService.runInContext(
      async (): Promise<TResponse<IFaceVerify | null>> => {
        try {
          const data = await this.detectPublicService.verifyFace(
            request.data.cardId,
            request.data.detectionId
          );
          if (data === CANCELED_PROMISE_SYMBOL) {
            throw new Error("request canceled");
          }
          this.loggerService.log("findFaceGlobalService verifyFace ok", {
            request,
            data,
          });
          return {
            status: "ok",
            serviceName: request.serviceName,
            clientId: request.clientId,
            userId: request.userId,
            requestId: request.requestId,
            data,
          };
        } catch (error: any) {
          if (error?.statusCode === 401 || error?.statusCode === 403) {
            this.loggerService.log("findFaceGlobalService verifyFace 401", {
              request,
            });
            this.getToken.clear();
            return await this.verifyFace(request);
          }
          this.loggerService.log("findFaceGlobalService verifyFace error", {
            request,
            error: errorData(error),
          });
          return {
            status: "error",
            error: getErrorMessage(error),
            clientId: request.clientId,
            requestId: request.requestId,
            serviceName: request.serviceName,
            userId: request.userId,
          };
        }
      },
      {
        clientId: request.clientId,
        serviceName: request.serviceName,
        requestId: request.userId,
        userId: request.userId,
        token: await this.getToken({
          clientId: request.clientId,
          requestId: request.requestId,
          serviceName: request.serviceName,
          userId: request.userId,
        }),
      }
    );
  };

  public verifyDetect = async (
    request: TRequest<{ detectionId2: string; detectionId1: string }>
  ) => {
    this.loggerService.log("findFaceGlobalService verifyDetect", { request });
    return await ContextService.runInContext(
      async (): Promise<TResponse<IDetectVerify | null>> => {
        try {
          const data = await this.detectPublicService.verifyDetect(
            request.data.detectionId1,
            request.data.detectionId2
          );
          if (data === CANCELED_PROMISE_SYMBOL) {
            throw new Error("request canceled");
          }
          this.loggerService.log("findFaceGlobalService verifyDetect ok", {
            request,
            data,
          });
          return {
            status: "ok",
            serviceName: request.serviceName,
            clientId: request.clientId,
            userId: request.userId,
            requestId: request.requestId,
            data,
          };
        } catch (error: any) {
          if (error?.statusCode === 401 || error?.statusCode === 403) {
            this.loggerService.log("findFaceGlobalService verifyDetect 401", {
              request,
            });
            this.getToken.clear();
            return await this.verifyDetect(request);
          }
          this.loggerService.log("findFaceGlobalService verifyDetect error", {
            request,
            error: errorData(error),
          });
          return {
            status: "error",
            error: getErrorMessage(error),
            clientId: request.clientId,
            requestId: request.requestId,
            serviceName: request.serviceName,
            userId: request.userId,
          };
        }
      },
      {
        clientId: request.clientId,
        serviceName: request.serviceName,
        requestId: request.userId,
        userId: request.userId,
        token: await this.getToken({
          clientId: request.clientId,
          requestId: request.requestId,
          serviceName: request.serviceName,
          userId: request.userId,
        }),
      }
    );
  };

  public eventFace = async (request: TRequest<{ imageId: string }>) => {
    this.loggerService.log("findFaceGlobalService eventFace", { request });
    return await ContextService.runInContext(
      async (): Promise<TResponse<IFaceEvent>> => {
        try {
          const data = await this.detectPublicService.eventFace(
            request.data.imageId
          );
          if (data === CANCELED_PROMISE_SYMBOL) {
            throw new Error("request canceled");
          }
          this.loggerService.log("findFaceGlobalService eventFace ok", {
            request,
            data,
          });
          return {
            status: "ok",
            serviceName: request.serviceName,
            clientId: request.clientId,
            userId: request.userId,
            requestId: request.requestId,
            data,
          };
        } catch (error: any) {
          if (error?.statusCode === 401 || error?.statusCode === 403) {
            this.loggerService.log("findFaceGlobalService eventFace 401", {
              request,
            });
            this.getToken.clear();
            return await this.eventFace(request);
          }
          this.loggerService.log("findFaceGlobalService eventFace error", {
            request,
            error: errorData(error),
          });
          return {
            status: "error",
            error: getErrorMessage(error),
            clientId: request.clientId,
            requestId: request.requestId,
            serviceName: request.serviceName,
            userId: request.userId,
          };
        }
      },
      {
        clientId: request.clientId,
        serviceName: request.serviceName,
        requestId: request.userId,
        userId: request.userId,
        token: await this.getToken({
          clientId: request.clientId,
          requestId: request.requestId,
          serviceName: request.serviceName,
          userId: request.userId,
        }),
      }
    );
  };

  public eventFaceByCardId = async (request: TRequest<{ cardId: string }>) => {
    this.loggerService.log("findFaceGlobalService eventFaceByCardId", { request });
    return await ContextService.runInContext(
      async (): Promise<TResponse<IFaceEvent>> => {
        try {
          const data = await this.detectPublicService.eventFaceByCardId(
            request.data.cardId
          );
          if (data === CANCELED_PROMISE_SYMBOL) {
            throw new Error("request canceled");
          }
          this.loggerService.log("findFaceGlobalService eventFaceByCardId ok", {
            request,
            data,
          });
          return {
            status: "ok",
            serviceName: request.serviceName,
            clientId: request.clientId,
            userId: request.userId,
            requestId: request.requestId,
            data,
          };
        } catch (error: any) {
          if (error?.statusCode === 401 || error?.statusCode === 403) {
            this.loggerService.log("findFaceGlobalService eventFaceByCardId 401", {
              request,
            });
            this.getToken.clear();
            return await this.eventFaceByCardId(request);
          }
          this.loggerService.log("findFaceGlobalService eventFaceByCardId error", {
            request,
            error: errorData(error),
          });
          return {
            status: "error",
            error: getErrorMessage(error),
            clientId: request.clientId,
            requestId: request.requestId,
            serviceName: request.serviceName,
            userId: request.userId,
          };
        }
      },
      {
        clientId: request.clientId,
        serviceName: request.serviceName,
        requestId: request.userId,
        userId: request.userId,
        token: await this.getToken({
          clientId: request.clientId,
          requestId: request.requestId,
          serviceName: request.serviceName,
          userId: request.userId,
        }),
      }
    );
  };

  public createFace = async (
    request: TRequest<{ cardId: string; imageId: string }>
  ) => {
    this.loggerService.log("findFaceGlobalService createFace", { request });
    return await ContextService.runInContext(
      async (): Promise<TResponse<IFace>> => {
        try {
          const data = await this.facePublicService.createFace(
            request.data.cardId,
            request.data.imageId
          );
          if (data === CANCELED_PROMISE_SYMBOL) {
            throw new Error("request canceled");
          }
          this.loggerService.log("findFaceGlobalService createFace ok", {
            request,
            data,
          });
          return {
            status: "ok",
            serviceName: request.serviceName,
            clientId: request.clientId,
            userId: request.userId,
            requestId: request.requestId,
            data,
          };
        } catch (error: any) {
          if (error?.statusCode === 401 || error?.statusCode === 403) {
            this.loggerService.log("findFaceGlobalService createFace 401", {
              request,
            });
            this.getToken.clear();
            return await this.createFace(request);
          }
          this.loggerService.log("findFaceGlobalService createFace error", {
            request,
            error: errorData(error),
          });
          return {
            status: "error",
            error: getErrorMessage(error),
            clientId: request.clientId,
            requestId: request.requestId,
            serviceName: request.serviceName,
            userId: request.userId,
          };
        }
      },
      {
        clientId: request.clientId,
        serviceName: request.serviceName,
        requestId: request.userId,
        userId: request.userId,
        token: await this.getToken({
          clientId: request.clientId,
          requestId: request.requestId,
          serviceName: request.serviceName,
          userId: request.userId,
        }),
      }
    );
  };

  public listFace = async (request: TRequest<{ cardId: string }>) => {
    this.loggerService.log("findFaceGlobalService listFace", { request });
    return await ContextService.runInContext(
      async (): Promise<TResponse<IFace[]>> => {
        try {
          const data = await this.facePublicService.listFace(
            request.data.cardId
          );
          if (data === CANCELED_PROMISE_SYMBOL) {
            throw new Error("request canceled");
          }
          this.loggerService.log("findFaceGlobalService listFace ok", {
            request,
            data,
          });
          return {
            status: "ok",
            serviceName: request.serviceName,
            clientId: request.clientId,
            userId: request.userId,
            requestId: request.requestId,
            data,
          };
        } catch (error: any) {
          if (error?.statusCode === 401 || error?.statusCode === 403) {
            this.loggerService.log("findFaceGlobalService listFace 401", { request });
            this.getToken.clear();
            return await this.listFace(request);
          }
          this.loggerService.log("findFaceGlobalService listFace error", {
            request,
            error: errorData(error),
          });
          return {
            status: "error",
            error: getErrorMessage(error),
            clientId: request.clientId,
            requestId: request.requestId,
            serviceName: request.serviceName,
            userId: request.userId,
          };
        }
      },
      {
        clientId: request.clientId,
        serviceName: request.serviceName,
        requestId: request.userId,
        userId: request.userId,
        token: await this.getToken({
          clientId: request.clientId,
          requestId: request.requestId,
          serviceName: request.serviceName,
          userId: request.userId,
        }),
      }
    );
  };

  public removeFace = async (request: TRequest<{ faceId: string }>) => {
    this.loggerService.log("findFaceGlobalService removeFace", { request });
    return await ContextService.runInContext(
      async (): Promise<TResponse<null>> => {
        try {
          const data = await this.facePublicService.removeFace(
            request.data.faceId
          );
          if (data === CANCELED_PROMISE_SYMBOL) {
            throw new Error("request canceled");
          }
          this.loggerService.log("findFaceGlobalService removeFace ok", {
            request,
            data,
          });
          return {
            status: "ok",
            serviceName: request.serviceName,
            clientId: request.clientId,
            userId: request.userId,
            requestId: request.requestId,
            data: null,
          };
        } catch (error: any) {
          if (error?.statusCode === 401 || error?.statusCode === 403) {
            this.loggerService.log("findFaceGlobalService removeFace 401", {
              request,
            });
            this.getToken.clear();
            return await this.removeFace(request);
          }
          this.loggerService.log("findFaceGlobalService removeFace error", {
            request,
            error: errorData(error),
          });
          return {
            status: "error",
            error: getErrorMessage(error),
            clientId: request.clientId,
            requestId: request.requestId,
            serviceName: request.serviceName,
            userId: request.userId,
          };
        }
      },
      {
        clientId: request.clientId,
        serviceName: request.serviceName,
        requestId: request.userId,
        userId: request.userId,
        token: await this.getToken({
          clientId: request.clientId,
          requestId: request.requestId,
          serviceName: request.serviceName,
          userId: request.userId,
        }),
      }
    );
  };

  public findByDetection = async (
    request: TRequest<{ detectionId: string }>
  ) => {
    this.loggerService.log("findFaceGlobalService findByDetection", { request });
    return await ContextService.runInContext(
      async (): Promise<TResponse<IHumanCardRow | null>> => {
        try {
          const data = await this.cardPublicService.findByDetection(
            request.data.detectionId
          );
          if (data === CANCELED_PROMISE_SYMBOL) {
            throw new Error("request canceled");
          }
          this.loggerService.log("findFaceGlobalService findByDetection ok", {
            request,
            data,
          });
          return {
            status: "ok",
            serviceName: request.serviceName,
            clientId: request.clientId,
            userId: request.userId,
            requestId: request.requestId,
            data,
          };
        } catch (error: any) {
          if (error?.statusCode === 401 || error?.statusCode === 403) {
            this.loggerService.log("findFaceGlobalService findByDetection 401", {
              request,
            });
            this.getToken.clear();
            return await this.findByDetection(request);
          }
          this.loggerService.log("findFaceGlobalService findByDetection error", {
            request,
            error: errorData(error),
          });
          return {
            status: "error",
            error: getErrorMessage(error),
            clientId: request.clientId,
            requestId: request.requestId,
            serviceName: request.serviceName,
            userId: request.userId,
          };
        }
      },
      {
        clientId: request.clientId,
        serviceName: request.serviceName,
        requestId: request.userId,
        userId: request.userId,
        token: await this.getToken({
          clientId: request.clientId,
          serviceName: request.serviceName,
          requestId: request.userId,
          userId: request.userId,
        }),
      }
    );
  };

  public findByCardId = async (request: TRequest<{ cardId: string }>) => {
    this.loggerService.log("findFaceGlobalService findByCardId", { request });
    return await ContextService.runInContext(
      async (): Promise<TResponse<IHumanCardRow | null>> => {
        try {
          const data = await this.cardPublicService.findByCardId(
            request.data.cardId
          );
          if (data === CANCELED_PROMISE_SYMBOL) {
            throw new Error("request canceled");
          }
          this.loggerService.log("findFaceGlobalService findByCardId ok", {
            request,
            data,
          });
          return {
            status: "ok",
            serviceName: request.serviceName,
            clientId: request.clientId,
            userId: request.userId,
            requestId: request.requestId,
            data,
          };
        } catch (error: any) {
          if (error?.statusCode === 401 || error?.statusCode === 403) {
            this.loggerService.log("findFaceGlobalService findByCardId 401", {
              request,
            });
            this.getToken.clear();
            return await this.findByCardId(request);
          }
          this.loggerService.log("findFaceGlobalService findByCardId error", {
            request,
            error: errorData(error),
          });
          return {
            status: "error",
            error: getErrorMessage(error),
            clientId: request.clientId,
            requestId: request.requestId,
            serviceName: request.serviceName,
            userId: request.userId,
          };
        }
      },
      {
        clientId: request.clientId,
        serviceName: request.serviceName,
        requestId: request.userId,
        userId: request.userId,
        token: await this.getToken({
          clientId: request.clientId,
          serviceName: request.serviceName,
          requestId: request.userId,
          userId: request.userId,
        }),
      }
    );
  };

  public createHumanCard = async (request: TRequest<IHumanCardDto>) => {
    this.loggerService.log("findFaceGlobalService createHumanCard", { request });
    return await ContextService.runInContext(
      async (): Promise<TResponse<IHumanCardRow>> => {
        try {
          const data = await this.cardPublicService.createHumanCard(
            request.data
          );
          if (data === CANCELED_PROMISE_SYMBOL) {
            throw new Error("request canceled");
          }
          this.loggerService.log("findFaceGlobalService createHumanCard ok", {
            request,
            data,
          });
          return {
            status: "ok",
            serviceName: request.serviceName,
            clientId: request.clientId,
            userId: request.userId,
            requestId: request.requestId,
            data,
          };
        } catch (error: any) {
          if (error?.statusCode === 401 || error?.statusCode === 403) {
            this.loggerService.log("findFaceGlobalService createHumanCard 401", {
              request,
            });
            this.getToken.clear();
            return await this.createHumanCard(request);
          }
          this.loggerService.log("findFaceGlobalService createHumanCard error", {
            request,
            error: errorData(error),
          });
          return {
            status: "error",
            error: getErrorMessage(error),
            clientId: request.clientId,
            requestId: request.requestId,
            serviceName: request.serviceName,
            userId: request.userId,
          };
        }
      },
      {
        clientId: request.clientId,
        serviceName: request.serviceName,
        requestId: request.userId,
        userId: request.userId,
        token: await this.getToken({
          clientId: request.clientId,
          serviceName: request.serviceName,
          requestId: request.userId,
          userId: request.userId,
        }),
      }
    );
  };

  public updateHumanCard = async (
    request: TRequest<{ id: number; dto: IHumanCardDto }>
  ) => {
    this.loggerService.log("findFaceGlobalService updateHumanCard", { request });
    return await ContextService.runInContext(
      async (): Promise<TResponse<IHumanCardRow>> => {
        try {
          const data = await this.cardPublicService.updateHumanCard(
            request.data.id,
            request.data.dto
          );
          if (data === CANCELED_PROMISE_SYMBOL) {
            throw new Error("request canceled");
          }
          this.loggerService.log("findFaceGlobalService updateHumanCard ok", {
            request,
            data,
          });
          return {
            status: "ok",
            serviceName: request.serviceName,
            clientId: request.clientId,
            userId: request.userId,
            requestId: request.requestId,
            data,
          };
        } catch (error: any) {
          if (error?.statusCode === 401 || error?.statusCode === 403) {
            this.loggerService.log("findFaceGlobalService updateHumanCard 401", {
              request,
            });
            this.getToken.clear();
            return await this.updateHumanCard(request);
          }
          this.loggerService.log("findFaceGlobalService updateHumanCard error", {
            request,
            error: errorData(error),
          });
          return {
            status: "error",
            error: getErrorMessage(error),
            clientId: request.clientId,
            requestId: request.requestId,
            serviceName: request.serviceName,
            userId: request.userId,
          };
        }
      },
      {
        clientId: request.clientId,
        serviceName: request.serviceName,
        requestId: request.userId,
        userId: request.userId,
        token: await this.getToken({
          clientId: request.clientId,
          serviceName: request.serviceName,
          requestId: request.userId,
          userId: request.userId,
        }),
      }
    );
  };

  public addHumanCardAttachment = async (
    request: TRequest<{ id: number; imageId: string }>
  ) => {
    this.loggerService.log("findFaceGlobalService addHumanCardAttachment", {
      request,
    });
    return await ContextService.runInContext(
      async (): Promise<TResponse<IAttachment>> => {
        try {
          const data = await this.cardPublicService.addHumanCardAttachment(
            request.data.id,
            request.data.imageId
          );
          if (data === CANCELED_PROMISE_SYMBOL) {
            throw new Error("request canceled");
          }
          this.loggerService.log("findFaceGlobalService addHumanCardAttachment ok", {
            request,
            data,
          });
          return {
            status: "ok",
            serviceName: request.serviceName,
            clientId: request.clientId,
            userId: request.userId,
            requestId: request.requestId,
            data,
          };
        } catch (error: any) {
          if (error?.statusCode === 401 || error?.statusCode === 403) {
            this.loggerService.log(
              "findFaceGlobalService addHumanCardAttachment 401",
              { request }
            );
            this.getToken.clear();
            return await this.addHumanCardAttachment(request);
          }
          this.loggerService.log(
            "findFaceGlobalService addHumanCardAttachment error",
            { request, error: errorData(error) }
          );
          return {
            status: "error",
            error: getErrorMessage(error),
            clientId: request.clientId,
            requestId: request.requestId,
            serviceName: request.serviceName,
            userId: request.userId,
          };
        }
      },
      {
        clientId: request.clientId,
        serviceName: request.serviceName,
        requestId: request.userId,
        userId: request.userId,
        token: await this.getToken({
          clientId: request.clientId,
          serviceName: request.serviceName,
          requestId: request.userId,
          userId: request.userId,
        }),
      }
    );
  };

  public detectLicensePlate = async (request: TRequest<{ imageId: string }>) => {
    this.loggerService.log("findFaceGlobalService detectLicensePlate", { request });
    return await ContextService.runInContext(
      async (): Promise<TResponse<ILicensePlaceDetect[]>> => {
        try {
          const data = await this.detectPublicService.detectLicensePlate(
            request.data.imageId
          );
          if (data === CANCELED_PROMISE_SYMBOL) {
            throw new Error("request canceled");
          }
          this.loggerService.log("findFaceGlobalService detectLicensePlate ok", {
            request,
            data,
          });
          return {
            status: "ok",
            serviceName: request.serviceName,
            clientId: request.clientId,
            userId: request.userId,
            requestId: request.requestId,
            data,
          };
        } catch (error: any) {
          if (error?.statusCode === 401 || error?.statusCode === 403) {
            this.loggerService.log("findFaceGlobalService detectLicensePlate 401", {
              request,
            });
            this.getToken.clear();
            return await this.detectLicensePlate(request);
          }
          this.loggerService.log("findFaceGlobalService detectLicensePlate error", {
            request,
            error: errorData(error),
          });
          return {
            status: "error",
            error: getErrorMessage(error),
            clientId: request.clientId,
            requestId: request.requestId,
            serviceName: request.serviceName,
            userId: request.userId,
          };
        }
      },
      {
        clientId: request.clientId,
        serviceName: request.serviceName,
        requestId: request.userId,
        userId: request.userId,
        token: await this.getToken({
          clientId: request.clientId,
          requestId: request.requestId,
          serviceName: request.serviceName,
          userId: request.userId,
        }),
      }
    );
  };

  public detectLicensePlateByBlob = async (request: TRequest<{ imageFile: Blob }>) => {
    this.loggerService.log("findFaceGlobalService detectLicensePlateByBlob", { request });
    return await ContextService.runInContext(
      async (): Promise<TResponse<ILicensePlaceDetect[]>> => {
        try {
          const data = await this.detectPublicService.detectLicensePlateByBlob(
            request.data.imageFile
          );
          if (data === CANCELED_PROMISE_SYMBOL) {
            throw new Error("request canceled");
          }
          this.loggerService.log("findFaceGlobalService detectLicensePlateByBlob ok", {
            request,
            data,
          });
          return {
            status: "ok",
            serviceName: request.serviceName,
            clientId: request.clientId,
            userId: request.userId,
            requestId: request.requestId,
            data,
          };
        } catch (error: any) {
          if (error?.statusCode === 401 || error?.statusCode === 403) {
            this.loggerService.log("findFaceGlobalService detectLicensePlateByBlob 401", {
              request,
            });
            this.getToken.clear();
            return await this.detectLicensePlateByBlob(request);
          }
          this.loggerService.log("findFaceGlobalService detectLicensePlateByBlob error", {
            request,
            error: errorData(error),
          });
          return {
            status: "error",
            error: getErrorMessage(error),
            clientId: request.clientId,
            requestId: request.requestId,
            serviceName: request.serviceName,
            userId: request.userId,
          };
        }
      },
      {
        clientId: request.clientId,
        serviceName: request.serviceName,
        requestId: request.userId,
        userId: request.userId,
        token: await this.getToken({
          clientId: request.clientId,
          requestId: request.requestId,
          serviceName: request.serviceName,
          userId: request.userId,
        }),
      }
    );
  };

  public captureScreenshot = async (request: TRequest<{ cameraId: number }>) => {
    this.loggerService.log("findFaceGlobalService captureScreenshot", { request });
    return await ContextService.runInContext(
      async (): Promise<TResponse<Blob>> => {
        try {
          const data = await this.capturePublicService.captureScreenshot(
            request.data.cameraId
          );
          if (data === CANCELED_PROMISE_SYMBOL) {
            throw new Error("request canceled");
          }
          this.loggerService.log("findFaceGlobalService captureScreenshot ok", {
            request,
            data,
          });
          return {
            status: "ok",
            serviceName: request.serviceName,
            clientId: request.clientId,
            userId: request.userId,
            requestId: request.requestId,
            data,
          };
        } catch (error: any) {
          if (error?.statusCode === 401 || error?.statusCode === 403) {
            this.loggerService.log("findFaceGlobalService captureScreenshot 401", {
              request,
            });
            this.getToken.clear();
            return await this.captureScreenshot(request);
          }
          this.loggerService.log("findFaceGlobalService captureScreenshot error", {
            request,
            error: errorData(error),
          });
          return {
            status: "error",
            error: getErrorMessage(error),
            clientId: request.clientId,
            requestId: request.requestId,
            serviceName: request.serviceName,
            userId: request.userId,
          };
        }
      },
      {
        clientId: request.clientId,
        serviceName: request.serviceName,
        requestId: request.userId,
        userId: request.userId,
        token: await this.getToken({
          clientId: request.clientId,
          requestId: request.requestId,
          serviceName: request.serviceName,
          userId: request.userId,
        }),
      }
    );
  };
}

export default ListenerService;
