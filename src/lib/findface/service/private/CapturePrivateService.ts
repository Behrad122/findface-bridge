import { inject } from "../../core/di";
import LoggerService from "../base/LoggerService";
import TokenService from "../base/TokenService";
import TYPES from "../../config/types";
import { CC_FINDFACE_URL } from "../../config/params";
import { TContextService } from "../base/ContextService";
import RequestFactory from "../../common/RequestFactory";
import { ttl } from "functools-kit";

const CAPTURE_WIDTH = 0;
const CAPTURE_DELAY = 1_000;

export class CapturePrivateService {
  protected readonly loggerService = inject<LoggerService>(TYPES.loggerService);
  protected readonly tokenService = inject<TokenService>(TYPES.tokenService);
  protected readonly contextService = inject<TContextService>(
    TYPES.contextService
  );

  public captureScreenshot = ttl(async (cameraId: number): Promise<Blob> => {
    this.loggerService.logCtx(`capturePrivateService captureScreenshot`, {
      cameraId,
    });
    const url = new URL(`${CC_FINDFACE_URL}/cameras/${cameraId}/screenshot/`);
    if (CAPTURE_WIDTH) {
      url.searchParams.set("width", String(CAPTURE_WIDTH));
    }
    const factory = RequestFactory.makeRequest(
      `capturePrivateService captureScreenshot`,
      url.toString(),
      {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          Authorization: `Token ${this.tokenService.getToken()}`,
        },
      },
      this.contextService.context
    );
    const response = await factory.fetch();
    return await response.blob();
  }, {
    key: ([cameraId]) => `${cameraId}`,
    timeout: CAPTURE_DELAY,
  });
}

export default CapturePrivateService;
