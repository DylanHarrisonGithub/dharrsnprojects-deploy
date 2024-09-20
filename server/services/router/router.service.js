"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("../../server"));
const config_1 = __importDefault(require("../../config/config"));
// pick preferred compatible response type
const negotiateCompatibleResponseContentType = (requestAccepts, routeContentType) => {
    var _a;
    // break down accepts string into [[type, subtype]]
    const reqTypes = requestAccepts.split(',').map(type => type.indexOf(';') > -1 ? type.substring(0, type.lastIndexOf(';')).toLowerCase().split('/') : type.toLowerCase().split('/'));
    const resTypes = routeContentType.split(',').map(type => type.indexOf(';') > -1 ? type.substring(0, type.lastIndexOf(';')).toLowerCase().split('/') : type.toLowerCase().split('/'));
    if (reqTypes.some(type => type[0] === '*')) {
        return resTypes[0].join('/');
    }
    if (resTypes.some(type => type[0] === '*')) {
        return reqTypes[0].join('/');
    } // should pretty much never happen
    let matches = resTypes.filter(resType => {
        if (reqTypes.some(reqType => resType[0] === reqType[0] &&
            (resType[1] === reqType[1] ||
                resType[1] === '*' || // should pretty much never happen
                reqType[1] === '*'))) {
            return true;
        }
    });
    matches = matches.map(resType => resType[1] !== '*' ? resType : reqTypes.find(reqType => resType[0] === reqType[0])); // but if resType[1] === '*', replace with specified reqType[1] 
    return ((_a = matches[0]) === null || _a === void 0 ? void 0 : _a.join('/')) || '';
};
const acceptsJSON = (accepts) => accepts.includes('application/json') || accepts.includes('*/*');
const acceptsHTML = (accepts) => accepts.includes('text/html') || accepts.includes('*/*');
const error = (request, response) => {
    if (acceptsJSON(request.accepts)) {
        return response;
    }
    else {
        return {
            code: 302,
            redirect: config_1.default.ERROR_URL + (new URLSearchParams(JSON.stringify(response)))
        };
    }
};
const router = (() => {
    const service = async (request) => {
        if (!request.route.length) {
            return new Promise(resolve => resolve({
                success: false,
                messages: ['SERVER - SERVICES - ROUTER - Route was not provided.'],
                body: error(request, {
                    code: 400,
                    json: {
                        success: false,
                        messages: ['Route was not provided.'],
                    }
                })
            }));
        }
        let route = server_1.default.routes[request.route];
        if (!route) {
            return new Promise(resolve => resolve({
                success: false,
                messages: [`SERVER - SERVICES - ROUTER - Provided route, '${request.route}' does not exist.`],
                body: error(request, {
                    code: 404,
                    json: {
                        success: false,
                        messages: [`Provided route, '${request.route}' does not exist.`],
                    }
                })
            }));
        }
        if (!(route.method.indexOf(request.method) > -1)) {
            return new Promise(resolve => resolve({
                success: false,
                messages: [
                    'SERVER - SERVICES - ROUTER - Method not allowed.',
                    `SERVER - SERVICES - ROUTER - Provided route, '${request.route}' is ${route.method} method.`
                ],
                body: error(request, {
                    code: 405,
                    json: {
                        success: false,
                        messages: [
                            'Method not allowed.',
                            `Provided route, '${request.route}' is ${route.method} method.`
                        ]
                    }
                })
            }));
        }
        // for priveleged routes
        if (!(route.privilege.indexOf('guest') > -1)) {
            if (!(request.token)) {
                return new Promise(resolve => resolve({
                    success: false,
                    messages: ['SERVER - SERVICES - ROUTER - Authentication was not provided for protected route.'],
                    body: error(request, {
                        code: 401,
                        json: {
                            success: false,
                            messages: ['Authentication was not provided for protected route.']
                        }
                    })
                }));
            }
            let tokenRes = await server_1.default.services.authentication.verifyToken(request.token); // should check for success
            if (!(tokenRes.success)) {
                return new Promise(resolve => resolve({
                    success: false,
                    messages: ['SERVER - SERVICES - ROUTER - Provided authentication was not valid.', ...tokenRes.messages],
                    body: error(request, {
                        code: 403,
                        json: {
                            success: false,
                            messages: ['Provided authentication was not valid.', ...tokenRes.messages]
                        }
                    })
                }));
            }
            let token = tokenRes.body;
            if (!(token.hasOwnProperty('privilege') && route.privilege.indexOf(token.privilege) > -1)) {
                return new Promise(resolve => resolve({
                    success: false,
                    messages: ['SERVER - SERVICES - ROUTER - Provided authentication does not have privilege to access route.'],
                    body: error(request, {
                        code: 403,
                        json: {
                            success: false,
                            messages: ['Provided authentication does not have privilege to access route.']
                        }
                    })
                }));
            }
        }
        let validation = await server_1.default.services.validation(request.params, route.schema);
        if (!validation.success) {
            return new Promise(resolve => resolve({
                success: false,
                messages: [
                    'SERVER - SERVICES - ROUTER - Validation failed for route parameters.',
                    ...validation.body
                ],
                body: error(request, {
                    code: 400,
                    json: {
                        success: false,
                        messages: [
                            'Validation failed for route parameters.',
                            ...validation.body
                        ]
                    }
                })
            }));
        }
        const negotiated = negotiateCompatibleResponseContentType(request.accepts, route.contentType);
        if (!negotiated) {
            return new Promise(resolve => resolve({
                success: false,
                messages: [
                    `SERVER - SERVICES - ROUTER - Could not negotiate response type.`,
                    `SERVER - SERVICES - ROUTER - Request accepts ${request.accepts}.`,
                    `SERVER - SERVICES - ROUTER - Route provides ${route.contentType}`
                ],
                body: error(request, {
                    code: 400,
                    json: {
                        success: false,
                        messages: [
                            `Could not negotiate response type.`,
                            `Request accepts ${request.accepts}.`,
                            `Route provides ${route.contentType}`
                        ]
                    }
                })
            }));
        }
        // route access granted for request!
        request.accepts = negotiated;
        const body = await route.route(request);
        return new Promise(resolve => {
            var _a;
            return resolve({
                success: true,
                messages: [
                    `SERVER - SERVICES - ROUTER - Request successfully routed.`,
                    ...(((_a = body.json) === null || _a === void 0 ? void 0 : _a.messages) || [])
                ],
                body: body
            });
        });
    };
    return service;
})();
exports.default = router;
