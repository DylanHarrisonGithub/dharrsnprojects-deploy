"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_service_1 = __importDefault(require("../../services/db/db.service"));
exports.default = async (request) => {
    const { id } = request.params;
    const mailDeleteRes = await db_service_1.default.row.delete('mail', { id: id });
    if (!mailDeleteRes.success) {
        return new Promise(res => res({
            code: 500,
            json: {
                success: false,
                messages: [
                    `SERVER - ROUTES - MAILDELETE - Email could not be deleted.`,
                    ...mailDeleteRes.messages
                ]
            }
        }));
    }
    return new Promise(res => res({
        code: 200,
        json: {
            success: true,
            messages: [
                `SERVER - ROUTES - MAILDELETE - Email successfully deleted.`,
                ...mailDeleteRes.messages
            ]
        }
    }));
};
