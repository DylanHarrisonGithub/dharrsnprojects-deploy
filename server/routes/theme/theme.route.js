"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = require("../../definitions/data/data");
const db_service_1 = __importDefault(require("../../services/db/db.service"));
exports.default = async (request) => {
    const res = await db_service_1.default.row.read('theme');
    return new Promise(resolve => {
        var _a;
        return resolve({
            code: 200,
            json: {
                success: res.success,
                messages: res.messages,
                body: ((_a = res.body) === null || _a === void 0 ? void 0 : _a.length) ? res.body.sort((a, b) => b.id - a.id)[0] : data_1.defaultTheme
            }
        });
    });
};
