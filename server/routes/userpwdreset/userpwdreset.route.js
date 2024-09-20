"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const db_service_1 = __importDefault(require("../../services/db/db.service"));
exports.default = async (request) => {
    var _a;
    const { username, code, password } = request.params;
    const user = (_a = (await db_service_1.default.row.read('user', { username: username })).body) === null || _a === void 0 ? void 0 : _a[0];
    if (!user) {
        return new Promise(res => res({
            code: 400,
            json: {
                success: false,
                messages: [`SERVER - ROUTES - USERPWDRESET - User ${username} could not be found.`]
            }
        }));
    }
    if (user.tries > 2) {
        return new Promise(res => res({
            code: 400,
            json: {
                success: false,
                messages: [`SERVER - ROUTES - USERPWDRESET - Max attempts exceeded.`]
            }
        }));
    }
    const hash = await crypto_1.default.pbkdf2Sync(code, user.resetstamp, 32, 64, 'sha512').toString('hex');
    if (hash !== user.reset) {
        await db_service_1.default.row.update('user', { tries: user.tries + 1 }, { id: user.id });
        return new Promise(res => res({
            code: 400,
            json: {
                success: false,
                messages: [`SERVER - ROUTES - USERPWDRESET - Code is not valid.`]
            }
        }));
    }
    const timedifference = Date.now() - parseInt(user.resetstamp);
    if (timedifference > 300000) {
        return new Promise(res => res({
            code: 400,
            json: {
                success: false,
                messages: [`SERVER - ROUTES - USERPWDRESET - Code is expired.`]
            }
        }));
    }
    const newsalt = crypto_1.default.randomBytes(32).toString('hex');
    const newhash = await crypto_1.default.pbkdf2Sync(password, newsalt, 32, 64, 'sha512').toString('hex');
    const update = await db_service_1.default.row.update('user', { salt: newsalt, password: newhash }, { id: user.id });
    if (!update.success) {
        return new Promise(res => res({
            code: 500,
            json: {
                success: false,
                messages: [
                    `SERVER - ROUTES - USERPWDRESET - Error occured updating password.`,
                    ...update.messages
                ]
            }
        }));
    }
    return new Promise(res => res({
        code: 200,
        json: {
            success: true,
            messages: [`SERVER - ROUTES - USERPWDRESET - Password reset successfully.`]
        }
    }));
};
