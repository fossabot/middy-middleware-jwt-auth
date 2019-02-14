import { Middleware, MiddlewareFunction } from 'middy';
import { IAuthorizedEvent } from './IAuthorizedEvent';
export interface IAuthOptions {
    key: string;
}
/** A documented example module */
export declare class JWTAuthMiddleware {
    private options;
    /** The logger used in the module */
    private readonly logger;
    static create: Middleware<IAuthOptions>;
    /** Creates a new Module */
    constructor(options: IAuthOptions);
    /** Starts the module */
    before: MiddlewareFunction<IAuthorizedEvent>;
}
declare const _default: Middleware<IAuthOptions, any, any>;
export default _default;
