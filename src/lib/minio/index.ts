import TYPES from "./config/types";
import "./config/provide";
import { inject, init } from "./core/di";
import type LoggerService from "./services/base/LoggerService";
import ErrorService from "./services/base/ErrorService";
import MinioService from "./services/base/MinioService";
import ImageDataPrivateService from "./services/private/ImageDataPrivateService";
import ImageDataPublicService from "./services/public/ImageDataPublicService";
import ImageDataGlobalService from "./services/global/ImageDataGlobalService";

const baseServices = {
    minioService: inject<MinioService>(TYPES.minioService),
    loggerService: inject<LoggerService>(TYPES.loggerService),
    errorService: inject<ErrorService>(TYPES.errorService),
};

const privateServices = {
    imageDataPrivateService: inject<ImageDataPrivateService>(TYPES.imageDataPrivateService),
};

const publicServices = {
    imageDataPublicService: inject<ImageDataPublicService>(TYPES.imageDataPublicService),
};

const globalServices = {
    imageDataGlobalService: inject<ImageDataGlobalService>(TYPES.imageDataGlobalService),
};

init();

export const minio = {
    ...baseServices,
    ...privateServices,
    ...publicServices,
    ...globalServices,
};

Object.assign(globalThis, { minio });
