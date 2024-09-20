"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const file_service_1 = __importDefault(require("../../services/file/file.service"));
const data_1 = require("../../definitions/data/data");
const config_1 = __importDefault(require("../../config/config"));
exports.default = async (request) => {
    const filename = Object.keys(request.files)[0];
    if (!filename) {
        return new Promise(res => res({
            code: 400,
            json: {
                success: false,
                messages: [
                    "SERVER - ROUTES - UPLOADMEDIA - Failed to upload file.",
                    "SERVER - ROUTES - UPLOADMEDIA - No file was received."
                ]
            }
        }));
    }
    if (!(data_1.acceptedMediaExtensions.image.filter(accepted => filename.toLowerCase().endsWith(accepted)).length ||
        data_1.acceptedMediaExtensions.video.filter(accepted => filename.toLowerCase().endsWith(accepted)).length)) {
        return new Promise(res => res({
            code: 400,
            json: {
                success: false,
                messages: [
                    "SERVER - ROUTES - UPLOADMEDIA - Failed to upload file.",
                    "SERVER - ROUTES - UPLOADMEDIA - File type not allowed.",
                    //`SERVER - ROUTES - UPLOADMEDIA - Allowed file extensions: ${acceptedMediaExtensions.image + ", " + acceptedMediaExtensions.video}.`,
                ]
            }
        }));
    }
    const uploadRes = await (new Promise((uRes) => {
        request.files[Object.keys(request.files)[0]].mv(path_1.default.normalize(config_1.default.ROOT_DIR + '/public/media/') + Object.keys(request.files)[0], async (err) => {
            if (err) {
                uRes({
                    success: false,
                    messages: ["SERVER - ROUTES - UPLOADMEDIA - Failed to upload file."].concat(err.toString())
                });
            }
            else {
                uRes({
                    success: true,
                    messages: ["SERVER - ROUTES - UPLOADMEDIA - File uploaded successfully."]
                });
            }
        });
    }));
    if (!uploadRes.success) {
        return new Promise(res => res({
            code: 500,
            json: {
                success: false,
                messages: uploadRes.messages
            }
        }));
    }
    const fRead = await file_service_1.default.readDirectory('public/media');
    if (!fRead.success) {
        return new Promise(res => res({
            code: 207,
            json: {
                success: true,
                messages: [
                    "SERVER - ROUTES - UPLOADMEDIA - Media successfully uploaded!",
                    `Server - Routes - UPLOADMEDIA - Failed to load media list.`,
                    ...fRead.messages
                ],
                body: []
            }
        }));
    }
    return new Promise(res => res({
        code: 200,
        json: {
            success: true,
            messages: [
                "SERVER - ROUTES - UPLOADMEDIA - Media successfully uploaded!",
                "SERVER - ROUTES - UPLOADMEDIA - Successfully loaded media list!"
            ],
            body: fRead.body
        }
    }));
};
