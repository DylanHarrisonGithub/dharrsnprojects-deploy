"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_service_1 = __importDefault(require("../../services/db/db.service"));
exports.default = async (request) => {
    const { id } = request.params;
    const projectDeleteRes = await db_service_1.default.row.delete('project', { id: id });
    if (!projectDeleteRes.success) {
        return new Promise(res => res({
            code: 500,
            json: {
                success: false,
                messages: [
                    `SERVER - ROUTES - PROJECTDELETE - Project could not be deleted.`,
                    ...projectDeleteRes.messages
                ]
            }
        }));
    }
    return new Promise(res => res({
        code: 200,
        json: {
            success: true,
            messages: [
                `SERVER - ROUTES - PROJECTDELETE - Project successfully deleted.`,
                ...projectDeleteRes.messages
            ]
        }
    }));
};
