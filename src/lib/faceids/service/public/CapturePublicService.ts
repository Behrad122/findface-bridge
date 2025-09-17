import { inject } from "../../core/di";
import CapturePrivateService from "../private/CapturePrivateService";
import LoggerService from "../base/LoggerService";
import TYPES from "../../config/types";
import { CANCELED_PROMISE_SYMBOL, execpool, retry } from "functools-kit";

interface ICapturePrivateService extends CapturePrivateService {}

export type TCapturePublicService = {
  [key in keyof ICapturePrivateService]: any;
};

export class CapturePublicService implements TCapturePublicService {
  protected readonly loggerService = inject<LoggerService>(TYPES.loggerService);

  protected readonly capturePrivateService = inject<CapturePrivateService>(
    TYPES.capturePrivateService
  );

  public captureScreenshot = execpool<Blob | typeof CANCELED_PROMISE_SYMBOL>(
    retry(async (cameraId: number) => {
      this.loggerService.logCtx("capturePublicService captureScreenshot", {
        cameraId,
      });
      return await this.capturePrivateService.captureScreenshot(cameraId);
    }),
    {
      maxExec: 35,
      delay: 10,
    }
  );
}

export default CapturePublicService;