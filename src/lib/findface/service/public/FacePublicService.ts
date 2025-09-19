import { inject } from "../../core/di";
import FacePrivateService from "../private/FacePrivateService";
import LoggerService from "../base/LoggerService";
import TYPES from "../../config/types";
import { CANCELED_PROMISE_SYMBOL, execpool, retry } from "functools-kit";
import { IFace } from "../../model/Face.model";

const RETRY_COUNT = 5;
const RETRY_DELAY = 1_000;
const RETRY_CONDITION = (error) =>
  error?.statusCode !== 401 && error?.statusCode !== 403;

const MAX_EXEC = 50;
const EXEC_DELAY = 0;

interface IFacePrivateService extends FacePrivateService {}

export type TFacePublicService = {
  [key in keyof IFacePrivateService]: any;
};

export class FacePublicService implements TFacePublicService {
  protected readonly loggerService = inject<LoggerService>(TYPES.loggerService);

  protected readonly facePrivateService = inject<FacePrivateService>(
    TYPES.facePrivateService
  );

  public createFace = execpool<IFace | typeof CANCELED_PROMISE_SYMBOL>(
    retry(
      async (cardId: string, imageId: string) => {
        this.loggerService.logCtx("facePublicService createFace", {
          cardId,
          imageId,
        });
        return await this.facePrivateService.createFace(cardId, imageId);
      },
      RETRY_COUNT,
      RETRY_DELAY,
      RETRY_CONDITION
    ),
    {
      maxExec: MAX_EXEC,
      delay: EXEC_DELAY,
    }
  );

  public createFaceByBlob = execpool<IFace | typeof CANCELED_PROMISE_SYMBOL>(
    retry(
      async (cardId: string, blob: Blob) => {
        this.loggerService.logCtx("facePublicService createFaceByBlob", {
          cardId,
        });
        return await this.facePrivateService.createFaceByBlob(cardId, blob);
      },
      RETRY_COUNT,
      RETRY_DELAY,
      RETRY_CONDITION
    ),
    {
      maxExec: MAX_EXEC,
      delay: EXEC_DELAY,
    }
  );

  public listFace = execpool(
    retry(
      async (cardId: string) => {
        this.loggerService.logCtx("facePublicService listFace", {
          cardId,
        });
        return await this.facePrivateService.listFace(cardId);
      },
      RETRY_COUNT,
      RETRY_DELAY,
      RETRY_CONDITION
    ),
    {
      maxExec: MAX_EXEC,
      delay: EXEC_DELAY,
    }
  );

  public removeFace = execpool(
    retry(
      async (faceId: string) => {
        this.loggerService.logCtx("facePublicService removeFace", {
          faceId,
        });
        return await this.facePrivateService.removeFace(faceId);
      },
      RETRY_COUNT,
      RETRY_DELAY,
      RETRY_CONDITION
    ),
    {
      maxExec: MAX_EXEC,
      delay: EXEC_DELAY,
    }
  );
}

export default FacePublicService;
