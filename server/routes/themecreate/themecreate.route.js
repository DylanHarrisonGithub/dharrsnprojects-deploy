"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = require("../../definitions/data/data");
const db_service_1 = __importDefault(require("../../services/db/db.service"));
exports.default = async (request) => {
    // precaution to filter any additional params that were provided with request
    const filteredTheme = Object.fromEntries(Object.entries(request.params).filter(([key]) => key in data_1.defaultTheme));
    const dbres = await db_service_1.default.row.create('theme', filteredTheme);
    return new Promise(resolve => resolve({
        code: dbres.success ? 200 : 400,
        json: {
            success: dbres.success,
            messages: dbres.messages
        }
    }));
};
