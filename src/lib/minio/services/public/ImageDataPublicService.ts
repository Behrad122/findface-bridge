import TYPES from "../../config/types";
import ImageDataPrivateService from "../private/ImageDataPrivateService";
import LoggerService from "../base/LoggerService";
import { inject } from "../../core/di";
import { execpool } from "functools-kit";

interface IImageDataPrivateService extends ImageDataPrivateService { }

export type TImageDataPublicService = {
  [key in Exclude<
    keyof IImageDataPrivateService,
    "minioService" | "BUCKET_NAME"
  >]: any;
};

export class ImageDataPublicService implements TImageDataPublicService {
  protected readonly loggerService = inject<LoggerService>(TYPES.loggerService);
  protected readonly imageDataPrivateService = inject<ImageDataPrivateService>(
    TYPES.imageDataPrivateService
  );

  public putObject = execpool(
    async (fileBase64: string, fileName: string) => {
      this.loggerService.logCtx(`imageDataPublicService putObject`, { fileName });
      return await this.imageDataPrivateService.putObject(fileBase64, fileName);
    },
    {
      maxExec: 20,
      delay: 1_000,
    }
  );


  public putBuffer = execpool(
    async (buffer: Buffer, fileName: string) => {
      this.loggerService.logCtx(`imageDataPublicService putBuffer`, {
        fileName,
      });
      return await this.imageDataPrivateService.putBuffer(buffer, fileName);
    },
    {
      maxExec: 20,
      delay: 1_000,
    }
  );


  public deleteObject = execpool(
    async (fileId: string) => {
      this.loggerService.logCtx(`imageDataPublicService deleteObject`, { fileId });
      return await this.imageDataPrivateService.deleteObject(fileId);
    },
    {
      maxExec: 20,
      delay: 1_000,
    }
  );

  public getObject = execpool(
    async (fileId: string) => {
      this.loggerService.logCtx(`imageDataPublicService getObject`, { fileId });
      return await this.imageDataPrivateService.getObject(fileId);
    },
    {
      maxExec: 20,
      delay: 1_000,
    }
  );
}

export default ImageDataPublicService;
