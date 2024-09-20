"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_service_1 = __importDefault(require("../../services/db/db.service"));
exports.default = async (request) => {
    const safeupdate = [
        'username', 'avatar', 'privilege'
    ].reduce((a, v) => request.params.update[v] ? Object.assign(Object.assign({}, a), { [v]: request.params.update[v] }) : a, {});
    var queryResult = await db_service_1.default.row.update('user', safeupdate, { id: request.params.id });
    return new Promise(res => res({
        code: 200,
        json: {
            success: queryResult.success,
            messages: queryResult.messages
        }
    }));
};
