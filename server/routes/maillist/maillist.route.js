"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_service_1 = __importDefault(require("../../services/db/db.service"));
exports.default = async (request) => {
    const maillistRes = await db_service_1.default.row.read('mail');
    if (!maillistRes.success) {
        return new Promise(res => res({
            code: 500,
            json: {
                success: false,
                messages: [
                    `SERVER - ROUTES - MAILLIST - Email list could not be retrieved.`,
                    ...maillistRes.messages
                ]
            }
        }));
    }
    return new Promise(res => res({
        code: 200,
        json: {
            success: true,
            messages: [
                `SERVER - ROUTES - MAILLIST - Email list successfully retrieved.`,
                ...maillistRes.messages
            ],
            body: maillistRes.body
        }
    }));
};
