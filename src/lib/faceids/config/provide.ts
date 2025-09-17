import { provide } from "../core/di";
import TYPES from "./types";
import AuthService from "../service/base/AuthService";
import LoggerService from "../service/base/LoggerService";
import TokenService from "../service/base/TokenService";
import CardPrivateService from "../service/private/CardPrivateService";
import FacePrivateService from "../service/private/FacePrivateService";
import DetectPrivateService from "../service/private/DetectPrivateService";
import CapturePrivateService from "../service/private/CapturePrivateService";
import { CardPublicService } from "../service/public/CardPublicService";
import FacePublicService from "../service/public/FacePublicService";
import DetectPublicService from "../service/public/DetectPublicService";
import CapturePublicService from "../service/public/CapturePublicService";
import FaceIdsGlobalService from "../service/global/FaceIdsGlobalService";
import ContextService from "../service/base/ContextService";
import ErrorService from "../service/base/ErrorService";

{
    provide(TYPES.authService, () => new AuthService());
    provide(TYPES.loggerService, () => new LoggerService());
    provide(TYPES.tokenService, () => new TokenService());
    provide(TYPES.contextService, () => new ContextService());
    provide(TYPES.errorService, () => new ErrorService());
}

{
    provide(TYPES.cardPrivateService, () => new CardPrivateService());
    provide(TYPES.facePrivateService, () => new FacePrivateService());
    provide(TYPES.detectPrivateService, () => new DetectPrivateService());
    provide(TYPES.capturePrivateService, () => new CapturePrivateService());
}

{
    provide(TYPES.cardPublicService, () => new CardPublicService());
    provide(TYPES.facePublicService, () => new FacePublicService());
    provide(TYPES.detectPublicService, () => new DetectPublicService());
    provide(TYPES.capturePublicService, () => new CapturePublicService());
}

{
    provide(TYPES.faceIdsGlobalService, () => new FaceIdsGlobalService());
}
