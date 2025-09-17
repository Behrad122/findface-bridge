import { inject } from "../../core/di";
import FacePrivateService from "../private/FacePrivateService";
import LoggerService from "../base/LoggerService";
import TYPES from "../../config/types";
import { CANCELED_PROMISE_SYMBOL, execpool, retry } from "functools-kit";
import { IFace } from "../../model/Face.model";

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
    retry(async (cardId: string, imageId: string) => {
      this.loggerService.logCtx("facePublicService createFace", {
        cardId,
        imageId,
      });
      return await this.facePrivateService.createFace(cardId, imageId);
    }),
    {
      maxExec: 35,
      delay: 10,
    }
  );

  public listFace = execpool(
    retry(async (cardId: string) => {
      this.loggerService.logCtx("facePublicService listFace", {
        cardId,
      });
      return await this.facePrivateService.listFace(cardId);
    }),
    {
      maxExec: 35,
      delay: 10,
    }
  );

  public removeFace = execpool(
    retry(async (faceId: string) => {
      this.loggerService.logCtx("facePublicService removeFace", {
        faceId,
      });
      return await this.facePrivateService.removeFace(faceId);
    }),
    {
      maxExec: 35,
      delay: 10,
    }
  );
}

export default FacePublicService;
