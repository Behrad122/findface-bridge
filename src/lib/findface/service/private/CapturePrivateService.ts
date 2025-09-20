import { inject } from "../../core/di";
import LoggerService from "../base/LoggerService";
import TokenService from "../base/TokenService";
import TYPES from "../../config/types";
import { CC_FINDFACE_URL } from "../../config/params";
import { TContextService } from "../base/ContextService";
import RequestFactory from "../../common/RequestFactory";
import { sleep, ttl } from "functools-kit";

// Инициализируем WebCodecs polyfill для Node.js
import { } from "@remotion/webcodecs"

import {
  Output,
  BufferTarget,
  WebMOutputFormat,
  VideoSampleSource,
  VideoSample,
} from "mediabunny";

const CAPTURE_WIDTH = 0;
const CAPTURE_DELAY = 1_000;

const VIDEO_FRAME_RATE = 15;
const VIDEO_DURATION_SECONDS = 1;
const VIDEO_BITRATE = 1_000_000;

export class CapturePrivateService {
  protected readonly loggerService = inject<LoggerService>(TYPES.loggerService);
  protected readonly tokenService = inject<TokenService>(TYPES.tokenService);
  protected readonly contextService = inject<TContextService>(
    TYPES.contextService
  );

  public captureScreenshot = ttl(
    async (cameraId: number): Promise<Blob> => {
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
    },
    {
      key: ([cameraId]) => `${cameraId}`,
      timeout: CAPTURE_DELAY,
    }
  );

  public captureVideo = async (cameraId: number): Promise<Blob> => {
    this.loggerService.logCtx(`capturePrivateService captureVideo`, {
      cameraId,
    });

    // Получаем первый снимок чтобы узнать размеры
    const imageBlob = await this.captureScreenshot(cameraId);
    const imageBuffer = await imageBlob.arrayBuffer();

    const videoSource = new VideoSampleSource({
      codec: "vp9",
      bitrate: VIDEO_BITRATE,
    });

    const output = new Output({
      format: new WebMOutputFormat(),
      target: new BufferTarget(),
    });

    output.addVideoTrack(videoSource);

    // Генерируем кадры в цикле (как в твоем примере)
    const totalFrames = VIDEO_FRAME_RATE * VIDEO_DURATION_SECONDS;
    for (let i = 0; i < totalFrames; i++) {
      const timestamp = i / VIDEO_FRAME_RATE; // в секундах
      const duration = 1 / VIDEO_FRAME_RATE; // длительность кадра

      // Создаем VideoSample из буфера изображения
      const videoSample = new VideoSample(new Uint8Array(imageBuffer), {
        format: 'RGBA',
        codedWidth: 640, // TODO: определить реальные размеры из imageBuffer
        codedHeight: 480,
        timestamp: timestamp,
        duration: duration,
      });

      await videoSource.add(videoSample);
      await sleep(1000 / VIDEO_FRAME_RATE);
      videoSample.close();
    }

    await output.finalize();
    const videoBuffer = output.target.buffer;
    const videoBlob = new Blob([videoBuffer], { type: "video/webm" });

    return videoBlob;
  };
}

export default CapturePrivateService;
