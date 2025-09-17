import { scoped } from 'di-scoped';
import { inject } from '../../core/di';
import { TContextService } from './ContextService';
import TYPES from '../../config/types';

export class TokenService {

    protected readonly contextService = inject<TContextService>(TYPES.contextService);

    constructor() { }

    public getToken = () => {
        return this.contextService.context.token;
    };

}

export default TokenService;
