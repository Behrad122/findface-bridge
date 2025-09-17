import { provide } from '../core/di';

import TYPES from './types';

import LoggerService from '../services/base/LoggerService';
import MinioService from '../services/base/MinioService';
import ErrorService from '../services/base/ErrorService';
import ImageDataPrivateService from '../services/private/ImageDataPrivateService';
import ImageDataPublicService from '../services/public/ImageDataPublicService';
import ContextService from '../services/base/ContextService';
import ImageDataGlobalService from '../services/global/ImageDataGlobalService';

{
    provide(TYPES.minioService, () => new MinioService());
    provide(TYPES.loggerService, () => new LoggerService());
    provide(TYPES.errorService, () => new ErrorService());
    provide(TYPES.contextService, () => new ContextService());
}

{
    provide(TYPES.imageDataPrivateService, () => new ImageDataPrivateService());
}

{
    provide(TYPES.imageDataPublicService, () => new ImageDataPublicService());
}

{
    provide(TYPES.imageDataGlobalService, () => new ImageDataGlobalService());
}

