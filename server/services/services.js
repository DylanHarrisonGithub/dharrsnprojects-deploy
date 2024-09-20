"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_service_1 = __importDefault(require("./db/db.service"));
const file_service_1 = __importDefault(require("./file/file.service"));
const requestParser_service_1 = __importDefault(require("./requestParser/requestParser.service"));
const authentication_service_1 = __importDefault(require("./authentication/authentication.service"));
const router_service_1 = __importDefault(require("./router/router.service"));
const validation_service_1 = __importDefault(require("./validation/validation.service"));
const email_service_1 = __importDefault(require("./email/email.service"));
// syntactic hack to mandate that services conform to Service type
const services = (() => {
    const service = {
        db: db_service_1.default,
        file: file_service_1.default,
        authentication: authentication_service_1.default,
        requestParser: requestParser_service_1.default,
        validation: validation_service_1.default,
        router: router_service_1.default,
        email: email_service_1.default
    };
    return service;
})();
exports.default = services;
