import { inject } from "../../core/di";
import CapturePrivateService from "../private/CapturePrivateService";
import LoggerService from "../base/LoggerService";
import TYPES from "../../config/types";
import { CANCELED_PROMISE_SYMBOL, execpool, retry } from "functools-kit";

const RETRY_COUNT = 5;
const RETRY_DELAY = 1_000;
const RETRY_CONDITION = (error) =>
  error?.statusCode !== 401 && error?.statusCode !== 403;

const MAX_EXEC = 50;
const EXEC_DELAY = 0;

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
    retry(
      async (cameraId: number) => {
        this.loggerService.logCtx("capturePublicService captureScreenshot", {
          cameraId,
        });
        try {
          return await this.capturePrivateService.captureScreenshot(cameraId);
        } catch (error) {
          this.capturePrivateService.captureScreenshot.clear(`${cameraId}`);
          throw error;
        }
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

export default CapturePublicService;