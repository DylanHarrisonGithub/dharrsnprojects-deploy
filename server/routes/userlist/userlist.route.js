"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_service_1 = __importDefault(require("../../services/db/db.service"));
exports.default = async (request) => {
    var queryResult;
    if (request.params.id) {
        if (request.params.numrows) {
            queryResult = await db_service_1.default.row.stream('user', request.params.id, request.params.numrows);
        }
        else {
            queryResult = await db_service_1.default.row.read('user', { id: request.params.id });
        }
    }
    else {
        queryResult = await db_service_1.default.row.read('user');
    }
    return new Promise(res => {
        var _a;
        return res({
            code: 200,
            json: {
                success: queryResult.success,
                messages: queryResult.messages,
                body: (_a = queryResult.body) === null || _a === void 0 ? void 0 : _a.map(({ id, username, avatar, privilege }) => ({ id: id, username: username, avatar: avatar, privilege: privilege }))
            }
        });
    });
};
