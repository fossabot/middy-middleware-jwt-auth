import debugFactory from 'debug';
// import createError from 'http-errors'
import { isAuthorizedEvent } from './IAuthorizedEvent';
/** A documented example module */
var JWTAuthMiddleware = /** @class */ (function () {
    /** Creates a new Module */
    function JWTAuthMiddleware(options) {
        var _this = this;
        this.options = options;
        /** Starts the module */
        this.before = function (_a) {
            var event = _a.event;
            _this.logger('Checking whether event contains authorization data');
            if (!isAuthorizedEvent(event)) {
                _this.logger('No authorization data found');
                event.user = {};
                return;
            }
            event.user = {};
            _this.logger('Authorization data found');
        };
        this.logger = debugFactory('middy-middleware-jwt-auth');
    }
    JWTAuthMiddleware.create = function (options) {
        return new JWTAuthMiddleware(options);
    };
    return JWTAuthMiddleware;
}());
export { JWTAuthMiddleware };
export default JWTAuthMiddleware.create;
