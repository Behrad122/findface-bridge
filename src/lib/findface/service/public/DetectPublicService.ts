import { inject } from "../../core/di";
import DetectPrivateService from "../private/DetectPrivateService";
import LoggerService from "../base/LoggerService";
import TYPES from "../../config/types";
import { CANCELED_PROMISE_SYMBOL, execpool, retry } from "functools-kit";
import { IFaceDetect } from "../../model/FaceDetect.model";
import IFaceEvent from "../../model/FaceEvent.model";
import IFaceVerify from "../../model/FaceVerify.model";
import IDetectVerify from "../../model/DetectVerify.model";
import { ILicensePlaceDetect } from "../../model/LicensePlateDetect.model";

interface IDetectPrivateService extends DetectPrivateService {}

export type TDetectPublicService = {
  [key in keyof IDetectPrivateService]: any;
};

export class DetectPublicService implements TDetectPublicService {
  protected readonly loggerService = inject<LoggerService>(TYPES.loggerService);

  protected readonly detectPrivateService = inject<DetectPrivateService>(
    TYPES.detectPrivateService
  );

  public detectFace = execpool<IFaceDetect[] | typeof CANCELED_PROMISE_SYMBOL>(
    retry(async (imageId: string) => {
      this.loggerService.logCtx("detectPublicService detectFace", {
        imageId,
      });
      return await this.detectPrivateService.detectFace(imageId);
    }),
    {
      maxExec: 35,
      delay: 10,
    }
  );

  public detectFaceByBlob = execpool<IFaceDetect[] | typeof CANCELED_PROMISE_SYMBOL>(
    retry(async (blob: Blob) => {
      this.loggerService.logCtx("detectPublicService detectFaceByBlob");
      return await this.detectPrivateService.detectFaceByBlob(blob);
    }),
    {
      maxExec: 35,
      delay: 10,
    }
  )

  public eventFace = execpool<IFaceEvent | typeof CANCELED_PROMISE_SYMBOL>(
    retry(async (imageId: string) => {
      this.loggerService.logCtx("detectPublicService eventFace", {
        imageId,
      });
      return await this.detectPrivateService.eventFace(imageId);
    }),
    {
      maxExec: 35,
      delay: 10,
    }
  );

  public eventFaceByBlob = execpool<IFaceEvent | typeof CANCELED_PROMISE_SYMBOL>(
    retry(async (blob: Blob) => {
      this.loggerService.logCtx("detectPublicService eventFaceByBlob");
      return await this.detectPrivateService.eventFaceByBlob(blob);
    }),
    {
      maxExec: 35,
      delay: 10,
    }
  );

  public eventFaceByCardId = execpool<IFaceEvent | typeof CANCELED_PROMISE_SYMBOL>(
    retry(async (cardId: string) => {
      this.loggerService.logCtx("detectPublicService eventFaceByCardId", {
        cardId,
      });
      return await this.detectPrivateService.eventFaceByCardId(cardId);
    }),
    {
      maxExec: 35,
      delay: 10,
    }
  );

  public verifyFace = execpool<IFaceVerify | null | typeof CANCELED_PROMISE_SYMBOL>(
    retry(async (cardId: string, detectionId: string) => {
      this.loggerService.logCtx("detectPublicService verifyFace", {
        cardId,
        detectionId,
      });
      return await this.detectPrivateService.verifyFace(cardId, detectionId);
    }),
    {
      maxExec: 35,
      delay: 10,
    }
  );

  public verifyDetect = execpool<IDetectVerify | null | typeof CANCELED_PROMISE_SYMBOL>(
    retry(async (detectionId1: string, detectionId2: string) => {
      this.loggerService.logCtx("detectPublicService verifyDetect", {
        detectionId1,
        detectionId2,
      });
      return await this.detectPrivateService.verifyDetect(detectionId1, detectionId2);
    }),
    {
      maxExec: 35,
      delay: 10,
    }
  );

  public detectLicensePlate = execpool<ILicensePlaceDetect[] | typeof CANCELED_PROMISE_SYMBOL>(
    retry(async (imageId: string) => {
      this.loggerService.logCtx("detectPublicService detectLicensePlate", {
        imageId,
      });
      return await this.detectPrivateService.detectLicensePlate(imageId);
    }),
    {
      maxExec: 35,
      delay: 10,
    }
  );

  public detectLicensePlateByBlob = execpool<ILicensePlaceDetect[] | typeof CANCELED_PROMISE_SYMBOL>(
    retry(async (imageFile: Blob) => {
      this.loggerService.logCtx("detectPublicService detectLicensePlateByBlob");
      return await this.detectPrivateService.detectLicensePlateByBlob(imageFile);
    }),
    {
      maxExec: 35,
      delay: 10,
    }
  );
}

export default DetectPublicService;
