import { inject } from "../../core/di";
import LoggerService from "../base/LoggerService";
import TokenService from "../base/TokenService";
import TYPES from "../../config/types";
import { CC_FINDFACE_URL } from "../../config/params";
import { TContextService } from "../base/ContextService";
import RequestFactory from "../../common/RequestFactory";
import { createAwaiter, sleep, timeout, ttl } from "functools-kit";
import ffmpeg from "fluent-ffmpeg";
import { Readable, PassThrough, Writable } from "stream";

const CAPTURE_WIDTH = 0;
const CAPTURE_DELAY = 1_000;

const VIDEO_FRAME_RATE = 15;
const VIDEO_DURATION_SECONDS = 1;
const VIDEO_BITRATE = 1_000_000;

const VIDEO_DELAY = CAPTURE_DELAY * VIDEO_FRAME_RATE + CAPTURE_DELAY;
const VIDEO_TIMEOUT = 2 * VIDEO_DELAY;

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

  public captureVideo = ttl(
    timeout(async (cameraId: number): Promise<Blob> => {
      this.loggerService.logCtx(`capturePrivateService captureVideo`, {
        cameraId,
      });

      const totalFrames = VIDEO_FRAME_RATE * VIDEO_DURATION_SECONDS;

      const inputStream = new Readable({
        read() {},
      });

      const [result, { resolve, reject }] = createAwaiter<Blob>();

      let ffmpegProcess: PassThrough | Writable;

      {
        const outputStream = new PassThrough();
        const outputBuffers: Buffer[] = [];

        outputStream.on("data", (chunk) => outputBuffers.push(chunk));
        outputStream.on("end", () => {
          const videoBuffer = Buffer.concat(outputBuffers);
          const videoBlob = new Blob([videoBuffer], { type: "video/webm" });
          resolve(videoBlob);
        });
        outputStream.on("error", (err) => {
          console.log(
            `Output stream error: ${err.message} cameraId=${cameraId}`
          );
          ffmpegProcess.destroy();
          reject(err);
        });

        ffmpegProcess = ffmpeg()
          .input(inputStream)
          .inputFormat("image2pipe")
          .inputOptions(["-framerate", String(VIDEO_FRAME_RATE)])
          .outputOptions([
            "-c:v",
            "libvpx-vp9",
            "-b:v",
            String(VIDEO_BITRATE),
            "-pix_fmt",
            "yuv420p",
            "-r",
            String(VIDEO_FRAME_RATE),
            "-t",
            String(VIDEO_DURATION_SECONDS),
          ])
          .outputFormat("webm")
          .on("end", () => {
            ffmpegProcess.destroy(); // Завершаем процесс после успешного завершения
          })
          .on("error", (err) => {
            console.log(`FFmpeg error: ${err.message} cameraId=${cameraId}`);
            ffmpegProcess.destroy(); // Завершаем процесс при ошибке FFmpeg
            reject(err);
          })
          .pipe(outputStream);
      }

      try {
        for (let i = 0; i < totalFrames; i++) {
          const imageBlob = await this.captureScreenshot(cameraId);
          const imageBuffer = Buffer.from(await imageBlob.arrayBuffer());
          console.log(
            `Frame ${i} size: ${imageBuffer.length} cameraId=${cameraId}`
          );
          inputStream.push(imageBuffer);
          await sleep(CAPTURE_DELAY);
        }
        inputStream.push(null);
      } catch (err) {
        console.log(`Error in frame loop: ${err.message} cameraId=${cameraId}`);
        this.captureScreenshot.clear(`${cameraId}`);
        inputStream.destroy(err);
        ffmpegProcess.destroy();
        reject(err);
      }

      return await result;
    }, VIDEO_TIMEOUT),
    {
      key: ([cameraId]) => `${cameraId}`,
      timeout: VIDEO_DELAY,
    }
  );
}

export default CapturePrivateService;
