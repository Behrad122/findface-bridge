import { init, inject } from "./core/di";

import "./config/provide";
import AuthService from "./service/base/AuthService";
import TYPES from "./config/types";
import type LoggerService from "./service/base/LoggerService";
import TokenService from "./service/base/TokenService";
import CardPrivateService from "./service/private/CardPrivateService";
import FacePrivateService from "./service/private/FacePrivateService";
import DetectPrivateService from "./service/private/DetectPrivateService";
import CapturePrivateService from "./service/private/CapturePrivateService";
import { CardPublicService } from "./service/public/CardPublicService";
import FacePublicService from "./service/public/FacePublicService";
import DetectPublicService from "./service/public/DetectPublicService";
import CapturePublicService from "./service/public/CapturePublicService";
import FindFaceGlobalService from "./service/global/FindFaceGlobalService";
import ContextService, { TContextService } from "./service/base/ContextService";

const baseServices = {
    tokenService: inject<TokenService>(TYPES.tokenService),
    authService: inject<AuthService>(TYPES.authService),
    loggerService: inject<LoggerService>(TYPES.loggerService),
    contextService: inject<TContextService>(TYPES.contextService),
};

const privateSerivces = {
    cardPrivateService: inject<CardPrivateService>(TYPES.cardPrivateService),
    facePrivateService: inject<FacePrivateService>(TYPES.facePrivateService),
    detectPrivateService: inject<DetectPrivateService>(TYPES.detectPrivateService),
    capturePrivateService: inject<CapturePrivateService>(TYPES.capturePrivateService),
};

const publicServices = {
    cardPublicService: inject<CardPublicService>(TYPES.cardPublicService),
    facePublicService: inject<FacePublicService>(TYPES.facePublicService),
    detectPublicService: inject<DetectPublicService>(TYPES.detectPublicService),
    capturePublicService: inject<CapturePublicService>(TYPES.capturePublicService),
};

const globalServices = {
    findFaceGlobalService: inject<FindFaceGlobalService>(TYPES.findFaceGlobalService),
};

export const findface = {
    ...baseServices,
    ...privateSerivces,
    ...publicServices,
    ...globalServices,
};

init();

Object.assign(globalThis, { findface });

export { ContextService };
