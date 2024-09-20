"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const server_1 = __importDefault(require("../../server"));
const authentication = (() => {
    const service = {
        generateToken: (data) => new Promise(resolve => resolve({
            success: true,
            messages: [`Server - Services - Authentication - GenerateToken: Successfully generated token.`],
            body: jsonwebtoken_1.default.sign(data, server_1.default.config.SERVER_SECRET)
        })),
        verifyToken: (token) => new Promise(resolve => {
            try {
                let decoded = jsonwebtoken_1.default.verify(token, server_1.default.config.SERVER_SECRET);
                resolve({
                    success: true,
                    messages: [`Server - Services - Authentication - VerifyToken: Successfully verified token.`],
                    body: decoded
                });
            }
            catch (_a) {
                resolve({
                    success: false,
                    messages: [`Server - Services - Authentication - VerifyToken: Could not verify token.`]
                });
            }
        }),
        decodeToken: (token) => new Promise(resolve => {
            try {
                let decoded = jsonwebtoken_1.default.decode(token);
                resolve({
                    success: true,
                    messages: [`Server - Services - Authentication - DecodeToken: Successfully decoded token.`],
                    body: decoded
                });
            }
            catch (_a) {
                resolve({
                    success: false,
                    messages: [`Server - Services - Authentication - DecodeToken: Could not decode token.`]
                });
            }
        }),
        generateTimeToken: (data) => new Promise(resolve => {
            let now = Math.floor(Date.now() / 60000);
            now = now - (now % 10);
            let payload = now.toString() + server_1.default.config.SERVER_SECRET;
            if (data) {
                payload = JSON.stringify(data) + payload;
            }
            resolve({
                success: true,
                messages: [`Server - Services - Authentication - GenerateTimeToken: Successfully generated timed token.`],
                body: crypto_1.default.createHash('md5').update(payload).digest('hex').substring(0, 6)
            });
        }),
        verifyTimeToken: (data, token, ttlMinutes) => new Promise(resolve => {
            let ttl = 10;
            let now = Math.floor(Date.now() / 60000);
            now = now - (now % 10);
            let payload = now.toString() + server_1.default.config.SERVER_SECRET;
            if (data) {
                payload = JSON.stringify(data) + payload;
            }
            if (ttlMinutes && ttlMinutes > 10) {
                ttl = ttlMinutes;
            }
            let verified = false;
            let nowhash = "";
            while (ttl > 0) {
                nowhash = crypto_1.default.createHash('md5').update(payload).digest('hex').substring(0, 6);
                if (nowhash === token) {
                    verified = true;
                }
                ttl -= 10;
                now -= 10;
            }
            resolve({
                success: verified,
                messages: [
                    verified ?
                        `Server - Services - Authentication - VerifyTimeToken: Successfully verified timed token.`
                        :
                            `Server - Services - Authentication - VerifyTimeToken: Could not verify timed token.`
                ]
            });
        })
    };
    return service;
})();
exports.default = authentication;
