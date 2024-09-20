"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const db_service_1 = __importDefault(require("../../services/db/db.service"));
exports.default = async (request) => {
    var _a;
    const { email, code, opt } = request.params;
    const mail = (_a = (await db_service_1.default.row.read('mail', { email: email })).body) === null || _a === void 0 ? void 0 : _a[0];
    if (!mail) {
        return new Promise(res => res({
            code: 400,
            json: {
                success: false,
                messages: [
                    `SERVER - ROUTES - MAILOPT - Email does not exist.`
                ]
            }
        }));
    }
    const hash = await crypto_1.default.pbkdf2Sync(code, mail.salt, 32, 64, 'sha512').toString('hex');
    if (hash !== mail.code) {
        return new Promise(res => res({
            code: 400,
            json: {
                success: false,
                messages: [`SERVER - ROUTES - MAILOPT - Code is not valid.`]
            }
        }));
    }
    const timedifference = Date.now() - parseInt(mail.salt);
    if (timedifference > 300000) {
        return new Promise(res => res({
            code: 400,
            json: {
                success: false,
                messages: [`SERVER - ROUTES - MAILOPT - Code is expired.`]
            }
        }));
    }
    let result;
    if (opt) {
        result = await db_service_1.default.row.update('mail', { verified: 'true' }, { id: mail.id });
    }
    else {
        result = await db_service_1.default.row.delete('mail', { id: mail.id });
    }
    if (!result.success) {
        return new Promise(res => res({
            code: 500,
            json: {
                success: false,
                messages: [
                    opt ?
                        `SERVER - ROUTES - MAILOPT - Error opting in ${email}. Please try again later.`
                        :
                            `SERVER - ROUTES - MAILOPT - Error opting out ${email}. Please try again later.`,
                    ...result.messages
                ]
            }
        }));
    }
    return new Promise(res => res({
        code: 200,
        json: {
            success: true,
            messages: [
                opt ?
                    `SERVER - ROUTES - MAILOPT - ${email} successfully registered!.`
                    :
                        `SERVER - ROUTES - MAILOPT - ${email} successfully opted out.`,
                ...result.messages
            ]
        }
    }));
};
