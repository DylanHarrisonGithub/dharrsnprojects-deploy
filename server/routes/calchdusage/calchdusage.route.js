"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const file_service_1 = __importDefault(require("../../services/file/file.service"));
const config_1 = __importDefault(require("../../config/config"));
exports.default = async (request) => {
    const rootSize = await file_service_1.default.getDirectorySize('');
    const mediaSize = await file_service_1.default.getDirectorySize('public/media');
    const tracksSize = await file_service_1.default.getDirectorySize('public/tracks');
    //&& rootSize.body  && mediaSize.body  && tracksSize.body
    if (!(rootSize.success && mediaSize.success && tracksSize.success)) {
        return new Promise(res => res({
            code: 500,
            json: {
                success: false,
                messages: [
                    `SERVER - ROUTES - CALCHDUSAGE - Error calculating hd usage.`,
                    ...rootSize.messages,
                    ...mediaSize.messages,
                    ...tracksSize.messages
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
                ...mediaSize.messages,
                ...tracksSize.messages
            ],
            body: {
                rootSizeBytes: rootSize.body,
                mediaSizeBytes: mediaSize.body,
                tracksSizeBytes: tracksSize.body,
                maxSizeGB: config_1.default.MAX_HD_SIZE_GB
            }
        }
    }));
};
