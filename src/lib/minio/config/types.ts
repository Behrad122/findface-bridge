const baseServices = {
    errorService: Symbol('errorService'),
    loggerService: Symbol('loggerService'),
    minioService: Symbol('minioService'),
    contextService: Symbol('contextService'),
};

const privateServices = {
    imageDataPrivateService: Symbol('imageDataPrivateService'),
};

const publicServices = {
    imageDataPublicService: Symbol('imageDataPublicService'),
};

const globalServices = {
    imageDataGlobalService: Symbol('imageDataGlobalService'),
};

export const TYPES = {
    ...baseServices,
    ...privateServices,
    ...publicServices,
    ...globalServices,
};

export default TYPES;
