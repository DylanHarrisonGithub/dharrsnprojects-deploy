"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const file_service_1 = __importDefault(require("../../services/file/file.service"));
exports.default = async (request) => {
    const mList = await file_service_1.default.readDirectory('/public/media');
    return new Promise(res => res({
        code: 200,
        json: {
            success: mList.success,
            messages: [
                mList.success ?
                    "SERVER - ROUTES - MEDIALIST - Successfully loaded media list!"
                    :
                        `Server - Routes - MEDIALIST - Failed to load media list.`,
                ...mList.messages
            ],
            body: mList.body
        }
    }));
};
