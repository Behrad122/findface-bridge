import { createLogger } from 'pinolog';
import { inject } from '../../core/di';
import TYPES from '../../config/types';
import { TContextService } from './ContextService';

const logger = createLogger("minio.log");

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
        logger.log(...args, this.contextService.context);
    };

}

export default LoggerService
