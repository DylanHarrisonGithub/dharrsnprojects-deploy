"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const db_service_1 = __importDefault(require("../../services/db/db.service"));
const email_service_1 = __importDefault(require("../../services/email/email.service"));
const onetimepasscode_template_1 = __importDefault(require("../../email-templates/onetimepasscode.template"));
exports.default = async (request) => {
    var _a;
    const { email } = request.params;
    const mail = (_a = (await db_service_1.default.row.read('mail', { email: email })).body) === null || _a === void 0 ? void 0 : _a[0];
    if (mail && (mail.verified === 'false') && (Date.now() - parseInt(mail.salt) < 300000)) {
        return new Promise(res => res({
            code: 400,
            json: {
                success: false,
                messages: [
                    `SERVER - ROUTES - MAILGENCODE - Email cannot be sent another code at this time. Please try again later.`
                ]
            }
        }));
    }
    const code = crypto_1.default.randomBytes(4).toString('hex').toUpperCase().substring(0, 6).padEnd(6, '0');
    const stamp = Date.now().toString();
    const hash = await crypto_1.default.pbkdf2Sync(code, stamp, 32, 64, 'sha512').toString('hex');
    let result;
    if (mail) {
        result = await db_service_1.default.row.update('mail', {
            code: hash,
            salt: stamp,
            verified: 'false'
        }, { id: mail.id });
    }
    else {
        result = await db_service_1.default.row.create('mail', {
            email: email,
            code: hash,
            salt: stamp,
            verified: 'false'
        });
    }
    if (!result.success) {
        return new Promise(res => res({
            code: 500,
            json: {
                success: false,
                messages: [
                    `SERVER - ROUTES - MAILGENCODE - Error storing generated code for email ${email}.`,
                    ...result.messages
                ]
            }
        }));
    }
    const emailResult = await (0, email_service_1.default)(email, `iamzae.com code request`, undefined, //`${code}`
    (0, onetimepasscode_template_1.default)(code));
    if (!emailResult.success) {
        return new Promise(res => res({
            code: 500,
            json: {
                success: false,
                messages: [
                    `SERVER - ROUTES - MAILGENCODE - Error emailing generated code for ${email}.`,
                    ...emailResult.messages,
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
                `SERVER - ROUTES - MAILGENCODE - Code generated for ${email}.`,
                `SERVER - ROUTES - MAILGENCODE - Please check email inbox for user.`,
                ...emailResult.messages,
                ...result.messages
            ]
        }
    }));
};
