"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const exec = __importStar(require("child_process"));
const crypto_1 = __importDefault(require("crypto"));
const db_service_1 = __importDefault(require("../../services/db/db.service"));
exports.default = async (request) => {
    var _a;
    const { username, code } = request.params;
    const user = (_a = (await db_service_1.default.row.read('user', { username: username })).body) === null || _a === void 0 ? void 0 : _a[0];
    if (!user) {
        return new Promise(res => res({
            code: 400,
            json: {
                success: false,
                messages: [`SERVER - ROUTES - SHUTDOWN - User ${username} could not be found.`]
            }
        }));
    }
    if (user.tries > 2) {
        return new Promise(res => res({
            code: 400,
            json: {
                success: false,
                messages: [`SERVER - ROUTES - SHUTDOWN - Max attempts exceeded.`]
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
                messages: [`SERVER - ROUTES - SHUTDOWN - Code is not valid.`]
            }
        }));
    }
    const timedifference = Date.now() - parseInt(user.resetstamp);
    if (timedifference > 300000) {
        return new Promise(res => res({
            code: 400,
            json: {
                success: false,
                messages: [`SERVER - ROUTES - SHUTDOWN - Code is expired.`]
            }
        }));
    }
    // allow progam to continue through if possible.
    // exec.execSynch('pm2 stop all')
    exec.exec('pm2 stop all');
    return new Promise(res => res({
        code: 200,
        json: {
            success: true,
            messages: [`SERVER - ROUTES - SHUTDOWN - Server shutdown dispatched.`]
        }
    }));
};
