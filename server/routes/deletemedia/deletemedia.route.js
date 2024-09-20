"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const file_service_1 = __importDefault(require("../../services/file/file.service"));
exports.default = async (request) => {
    if (!(request.params.filename)) {
        return new Promise(res => res({
            code: 400,
            json: {
                success: false,
                messages: ["SERVER - ROUTES - DELETEMEDIA - Filename not provided."],
            }
        }));
    }
    try {
        const delres = await file_service_1.default.delete(`public/media/` + request.params.filename);
        if (!delres.success) {
            return new Promise(res => res({ code: 400, json: { success: true, messages: [
                        `SERVER - ROUTES - DELETEMEDIA - Media file ${request.params.filename} could not be deleted.`,
                        ...delres.messages
                    ] } }));
        }
        return new Promise(res => res({ code: 200, json: { success: true, messages: [`SERVER - ROUTES - DELETEMEDIA - Media file ${request.params.filename} successfully deleted.`] } }));
    }
    catch (err) {
        return new Promise(res => res({ code: 404, json: { success: false, messages: [
                    `SERVER - ROUTES - DELETEMEDIA - Media file ${request.params.filename} could not be deleted.`,
                    err.toString()
                ] } }));
    }
};
