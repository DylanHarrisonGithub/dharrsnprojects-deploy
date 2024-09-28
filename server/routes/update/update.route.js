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
const path = __importStar(require("path"));
const config_1 = __importDefault(require("../../config/config"));
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
                messages: [`SERVER - ROUTES - UPDATE - User ${username} could not be found.`]
            }
        }));
    }
    if (user.tries > 2) {
        return new Promise(res => res({
            code: 400,
            json: {
                success: false,
                messages: [`SERVER - ROUTES - UPDATE - Max attempts exceeded.`]
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
                messages: [`SERVER - ROUTES - UPDATE - Code is not valid.`]
            }
        }));
    }
    const timedifference = Date.now() - parseInt(user.resetstamp);
    if (timedifference > 300000) {
        return new Promise(res => res({
            code: 400,
            json: {
                success: false,
                messages: [`SERVER - ROUTES - UPDATE - Code is expired.`]
            }
        }));
    }
    if (!config_1.default.REPOSITORY.URL) {
        return new Promise(res => res({
            code: 500,
            json: {
                success: false,
                messages: [`SERVER - ROUTES - UPDATE - Server repository is not configured.`]
            }
        }));
    }
    try {
        const urlRes = exec.execSync(`sudo git remote set-url origin https://${config_1.default.REPOSITORY.PAT ? config_1.default.REPOSITORY.PAT + '@' : ''}${config_1.default.REPOSITORY.URL}`);
        const status = await exec.execSync(`sudo git fetch && sudo git status`);
        if (status.includes('Your branch is up to date')) {
            return new Promise(res => res({
                code: 200,
                json: {
                    success: true,
                    messages: [
                        `SERVER - ROUTES - UPDATE - Server did not update because it is already up to date.`,
                        status.toString()
                    ],
                }
            }));
        }
        if (status.includes('Your branch is behind')) {
            try {
                const rDir = path.resolve(config_1.default.ROOT_DIR);
                await exec.execSync(`sudo chmod +x update.sh`);
                const child = exec.spawn('sudo', ['sh', 'update.sh'], { detached: true, stdio: 'inherit', shell: true, cwd: rDir });
                child.unref();
                return new Promise(res => res({
                    code: 200,
                    json: {
                        success: true,
                        messages: [
                            `SERVER - ROUTES - UPDATE - Server UPDATE dispatched.`,
                            `SERVER - ROUTES - UPDATE - Server UPDATE will cause temporary outage.`,
                            // status.toString()            
                        ]
                    }
                }));
            }
            catch (e) {
                return new Promise(res => res({
                    code: 500,
                    json: {
                        success: false,
                        messages: [
                            `SERVER - ROUTES - UPDATE - Error occurred while updating server.`,
                            status.toString()
                        ]
                    }
                }));
            }
        }
        return new Promise(res => res({
            code: 500,
            json: {
                success: false,
                messages: [
                    `SERVER - ROUTES - UPDATE - Failed to update server.`,
                    `SERVER - ROUTES - UPDATE - Local repository may be configured incorrectly.`,
                    status.toString()
                ]
            }
        }));
    }
    catch (e) {
        return new Promise(res => res({
            code: 500,
            json: {
                success: false,
                messages: [`SERVER - ROUTES - UPDATE - Error occured checking for server updates.`, e]
            }
        }));
    }
    // should be unreacheable
    return new Promise(res => res({
        code: 500,
        json: {
            success: true,
            messages: [`SERVER - ROUTES - UPDATE - Server UPDATE may or may not have been dispatched.`]
        }
    }));
};
