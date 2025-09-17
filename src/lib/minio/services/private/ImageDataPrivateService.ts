import BaseStorage from "../../common/BaseStorage";
import { inject } from "../../core/di";
import LoggerService from "../base/LoggerService";
import TYPES from "../../config/types";

export class ImageDataPrivateService extends BaseStorage("findface-bridge-images") {

    protected readonly loggerService = inject<LoggerService>(TYPES.loggerService);

    public putObject = async (fileBase64: string, fileName: string) => {
        this.loggerService.logCtx(`imageDataService putObject`, { fileName });
        return await super.putObject(fileBase64, fileName);
    };

    public putBuffer = async (buffer: Buffer, fileName: string) => {
        this.loggerService.logCtx(`imageDataService putBuffer`, { fileName });
        return await super.putBuffer(buffer, fileName);
    };


    public deleteObject = async (fileId: string) => {
        this.loggerService.logCtx(`imageDataService deleteObject`, { fileId });
        return await super.deleteObject(fileId);
    };

    public getObject = async (fileId: string) => {
        this.loggerService.logCtx(`imageDataService getObject`, { fileId });
        return await super.getObject(fileId);
    };

}

export default ImageDataPrivateService;
