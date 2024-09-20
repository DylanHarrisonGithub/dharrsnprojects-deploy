"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const file_service_1 = __importDefault(require("../../services/file/file.service"));
const config_1 = __importDefault(require("../../config/config"));
exports.default = async (request) => {
    const rootSize = await file_service_1.default.getDirectorySize('');
    const mediaSize = await file_service_1.default.getDirectorySize('public');
    //&& rootSize.body  && mediaSize.body 
    if (!(rootSize.success && mediaSize.success)) {
        return new Promise(res => res({
            code: 500,
            json: {
                success: false,
                messages: [
                    `SERVER - ROUTES - CALCHDUSAGE - Error calculating hd usage.`,
                    ...rootSize.messages,
                    ...mediaSize.messages
                ]
            }
        }));
    }
    return new Promise(res => res({
        code: 200,
        json: {
            success: true,
            messages: [
                `SERVER - ROUTES - CALCHDUSAGE - HD usage successfully calculated.`,
                ...rootSize.messages,
                ...mediaSize.messages
            ],
            body: {
                rootSizeBytes: rootSize.body,
                mediaSizeBytes: mediaSize.body,
                maxSizeGB: config_1.default.MAX_HD_SIZE_GB
            }
        }
    }));
};
