"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_service_1 = __importDefault(require("../../services/db/db.service"));
const authentication_service_1 = __importDefault(require("../../services/authentication/authentication.service"));
const crypto_1 = __importDefault(require("crypto"));
exports.default = async (request) => {
    const { username, password } = request.params;
    const res = await db_service_1.default.row.read('user', { username: username });
    if (!res.success) {
        return new Promise(resolve => resolve({
            code: 500,
            json: {
                success: false,
                messages: [
                    `SERVER - ROUTES - LOGIN - Server or Database error attempting to login user ${username}.`
                ].concat(res.messages)
            }
        }));
    }
    if (!(res.body && res.body.length)) {
        return new Promise(resolve => resolve({
            code: 500,
            json: {
                success: false,
                messages: [`SERVER - ROUTES - LOGIN - User ${username} not found.`].concat(res.messages)
            }
        }));
    }
    const salt = res.body[0].salt;
    const hash = await crypto_1.default.pbkdf2Sync(password, salt, 32, 64, 'sha512').toString('hex');
    if (!(hash === res.body[0].password)) {
        return new Promise(resolve => resolve({
            code: 500,
            json: {
                success: false,
                messages: [`SERVER - ROUTES - LOGIN - Password did not match for user ${username}.`].concat(res.messages)
            }
        }));
    }
    const token = await authentication_service_1.default.generateToken({ username: username, privilege: res.body[0].privilege });
    if (!token.success) {
        return new Promise(resolve => resolve({
            code: 500,
            json: {
                success: false,
                messages: [`SERVER - ROUTES - LOGIN - Failed to generate token for user ${username}.`].concat(res.messages).concat(token.messages)
            }
        }));
    }
    return new Promise(resolve => resolve({
        code: 200,
        json: {
            success: true,
            messages: [`SERVER - ROUTES - LOGIN - User ${username} successfully logged in.`].concat(res.messages).concat(token.messages),
            body: { token: token.body, user: { username: res.body[0].username, id: res.body[0].id, avatar: res.body[0].avatar } }
        }
    }));
};
