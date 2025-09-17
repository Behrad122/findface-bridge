import { inject } from "../../core/di";
import ImageDataPublicService, {
  TImageDataPublicService,
} from "../public/ImageDataPublicService";
import LoggerService from "../base/LoggerService";
import TYPES from "../../config/types";
import ContextService, { IContext } from "../base/ContextService";

export class ImageDataGlobalService implements TImageDataPublicService {
  protected readonly loggerService = inject<LoggerService>(TYPES.loggerService);

  protected readonly imageDataPublicService = inject<ImageDataPublicService>(
    TYPES.imageDataPublicService
  );

  public putBuffer = async (
    buffer: Buffer,
    fileName: string,
    context: IContext
  ) => {
    this.loggerService.log(`imageDataPublicService putBuffer`, {
      fileName,
      context,
    });
    return await ContextService.runInContext(async () => {
      const result = await this.imageDataPublicService.putBuffer(
        buffer,
        fileName
      );
      this.loggerService.log(`imageDataPublicService putBuffer ok`, {
        fileName,
        context,
        result,
      });
      return result;
    }, context);
  };

  public putObject = async (
    fileBase64: string,
    fileName: string,
    context: IContext
  ) => {
    this.loggerService.log(`imageDataPublicService putObject`, {
      fileName,
      context,
    });
    return await ContextService.runInContext(async () => {
      const result = await this.imageDataPublicService.putObject(fileBase64, fileName);
      this.loggerService.log(`imageDataPublicService putObject ok`, {
        fileName,
        context,
        result,
      });
      return result;
    }, context);
  };

  public getObject = async (fileId: string, context: IContext) => {
    this.loggerService.log(`imageDataPublicService getObject`, {
      fileId,
      context,
    });
    return await ContextService.runInContext(async () => {
      const result = await this.imageDataPublicService.getObject(fileId);
      this.loggerService.log(`imageDataPublicService getObject ok`, {
        fileId,
        context,
      });
      return result;
    }, context);
  };

  public deleteObject = async (fileId: string, context: IContext) => {
    this.loggerService.log(`imageDataPublicService deleteObject`, {
      fileId,
      context,
    });
    return await ContextService.runInContext(async () => {
      const result = await this.imageDataPublicService.deleteObject(fileId);
      this.loggerService.log(`imageDataPublicService deleteObject ok`, {
        fileId,
        context,
      });
      return result;
    }, context);
  };
}

export default ImageDataGlobalService;
