const baseServices = {
    tokenService: Symbol('tokenService'),
    authService: Symbol('authService'),
    loggerService: Symbol('loggerService'),
    contextService: Symbol('contextService'),
    errorService: Symbol('errorService'),
};

const privateSerivces = {
    cardPrivateService: Symbol('cardPrivateService'),
    facePrivateService: Symbol('facePrivateService'),
    detectPrivateService: Symbol('detectPrivateService'),
    capturePrivateService: Symbol('capturePrivateService'),
};

const publicServices = {
    cardPublicService: Symbol('cardPublicService'),
    facePublicService: Symbol('facePublicService'),
    detectPublicService: Symbol('detectPublicService'),
    capturePublicService: Symbol('capturePublicService'),
};

const globalServices = {
    findFaceGlobalService: Symbol('findFaceGlobalService'),
};

export const TYPES = {
    ...baseServices,
    ...privateSerivces,
    ...publicServices,
    ...globalServices
};

export default TYPES;
