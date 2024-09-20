"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_service_1 = __importDefault(require("../../services/db/db.service"));
const authentication_service_1 = __importDefault(require("../../services/authentication/authentication.service"));
const crypto_1 = __importDefault(require("crypto"));
const config_1 = __importDefault(require("../../config/config"));
exports.default = async (request) => {
    var _a;
    const { admin, username, password, code, avatar, email } = request.params;
    const user = (_a = (await db_service_1.default.row.read('user', { username: admin })).body) === null || _a === void 0 ? void 0 : _a[0];
    if (!user) {
        return new Promise(res => res({
            code: 400,
            json: {
                success: false,
                messages: [`SERVER - ROUTES - REGISTER - Admin ${admin} could not be found.`]
            }
        }));
    }
    if (user.tries > 2) {
        return new Promise(res => res({
            code: 400,
            json: {
                success: false,
                messages: [`SERVER - ROUTES - REGISTER - Max attempts exceeded.`]
            }
        }));
    }
    let hash = await crypto_1.default.pbkdf2Sync(code, user.resetstamp, 32, 64, 'sha512').toString('hex');
    if (hash !== user.reset) {
        await db_service_1.default.row.update('user', { tries: user.tries + 1 }, { id: user.id });
        return new Promise(res => res({
            code: 400,
            json: {
                success: false,
                messages: [`SERVER - ROUTES - REGISTER - Code is not valid.`]
            }
        }));
    }
    const timedifference = Date.now() - parseInt(user.resetstamp);
    if (timedifference > 300000) {
        return new Promise(res => res({
            code: 400,
            json: {
                success: false,
                messages: [`SERVER - ROUTES - REGISTER - Code is expired.`]
            }
        }));
    }
    // 2fa auth successful
    const salt = crypto_1.default.randomBytes(32).toString('hex');
    hash = await crypto_1.default.pbkdf2Sync(password, salt, 32, 64, 'sha512').toString('hex');
    const res = await db_service_1.default.row.create('user', {
        username: username,
        email: email || config_1.default.ADMIN_EMAIL || ``,
        privilege: 'user',
        password: hash,
        salt: salt,
        avatar: ``,
        reset: ``,
        resetstamp: `0`,
        tries: 0
    });
    const token = await authentication_service_1.default.generateToken({ username: username, privilege: 'user', dummy: "" });
    if (res.success && token.success) {
        return new Promise(resolve => resolve({
            code: 200,
            json: {
                success: true,
                messages: [
                    `SERVER - ROUTES - REGISTER - New user ${username} registered.`
                ].concat(res.messages).concat(token.messages),
                body: { token: token.body }
            }
        }));
    }
    else {
        return new Promise(resolve => resolve({
            code: 500,
            json: {
                success: false,
                messages: [`SERVER - ROUTES - REGISTER - User ${username} could not be registered.`].concat(res.messages).concat(token.messages)
            }
        }));
    }
};
