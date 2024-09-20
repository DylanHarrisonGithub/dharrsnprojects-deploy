"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const db_service_1 = __importDefault(require("../../services/db/db.service"));
const email_service_1 = __importDefault(require("../../services/email/email.service"));
const onetimepasscode_template_1 = __importDefault(require("../../email-templates/onetimepasscode.template"));
const config_1 = __importDefault(require("../../config/config"));
exports.default = async (request) => {
    var _a;
    const { username } = request.params;
    const user = (_a = (await db_service_1.default.row.read('user', { username: username })).body) === null || _a === void 0 ? void 0 : _a[0];
    if (!user) {
        return new Promise(res => res({
            code: 400,
            json: {
                success: false,
                messages: [`SERVER - ROUTES - USERGENCODE - User ${username} could not be found.`]
            }
        }));
    }
    const code = crypto_1.default.randomBytes(4).toString('hex').toUpperCase().substring(0, 6).padEnd(6, '0');
    const stamp = Date.now().toString();
    const hash = await crypto_1.default.pbkdf2Sync(code, stamp, 32, 64, 'sha512').toString('hex');
    const updateResult = await db_service_1.default.row.update('user', {
        reset: hash,
        resetstamp: stamp,
        tries: 0
    }, { id: user.id });
    if (!updateResult.success) {
        return new Promise(res => res({
            code: 500,
            json: {
                success: false,
                messages: [
                    `SERVER - ROUTES - USERGENCODE - Error storing generated code for user ${username}.`,
                    ...updateResult.messages
                ]
            }
        }));
    }
    const recipient = [
        config_1.default.NODEMAILER.EMAIL,
        config_1.default.ADMIN_EMAIL,
        user.email
    ].reduce((pv, cv) => (cv && cv.length) ? cv : pv, 'NORECIPIENT');
    const emailResult = await (0, email_service_1.default)(recipient, `${user.username} code request`, undefined, //`${code}`,
    (0, onetimepasscode_template_1.default)(code));
    if (!emailResult.success) {
        return new Promise(res => res({
            code: 500,
            json: {
                success: false,
                messages: [
                    `SERVER - ROUTES - USERGENCODE - Error emailing generated code for user ${username}.`,
                    ...emailResult.messages,
                    ...updateResult.messages
                ]
            }
        }));
    }
    return new Promise(res => res({
        code: 200,
        json: {
            success: true,
            messages: [
                `SERVER - ROUTES - USERGENCODE - Code generated for user ${username}.`,
                `SERVER - ROUTES - USERGENCODE - Please check email inbox for user.`,
                ...emailResult.messages,
                ...updateResult.messages
            ]
        }
    }));
};
