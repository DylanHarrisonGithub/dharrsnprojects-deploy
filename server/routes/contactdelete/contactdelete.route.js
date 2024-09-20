"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_service_1 = __importDefault(require("../../services/db/db.service"));
exports.default = async (request) => {
    const { id } = request.params;
    const dbRes = await db_service_1.default.row.delete('contact', { id: id });
    if (dbRes.success) {
        return new Promise(res => res({
            code: 200,
            json: {
                success: true,
                messages: [
                    `SERVER - ROUTES - CONTACTDELETE - Contact deleted.`
                ].concat(dbRes.messages),
                body: dbRes.body
            }
        }));
    }
    else {
        return new Promise(res => res({
            code: 500,
            json: {
                success: false,
                messages: [
                    `SERVER - ROUTES - CONTACTDELETE - Contact could not be deleted.`
                ].concat(dbRes.messages),
                body: request.params
            }
        }));
    }
};
