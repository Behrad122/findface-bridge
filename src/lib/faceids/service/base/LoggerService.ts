import { createLogger } from 'pinolog';
import { inject } from '../../core/di';
import { TContextService } from './ContextService';
import TYPES from '../../config/types';
import { omit } from 'lodash-es';

const logger = createLogger("faceids.log");

const USE_LOGS = false;

export class LoggerService {

    protected readonly contextService = inject<TContextService>(TYPES.contextService);

    public log = (...args: any[]) => {
        if (!USE_LOGS) {
            return;
        }
        logger.log(...args);
    }

    public logCtx = (...args: any[]) => {
        if (!USE_LOGS) {
            return;
        }
        logger.log(...args, omit(this.contextService.context, "token"));
    };

}

export default LoggerService
