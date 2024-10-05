"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const schemas_1 = __importDefault(require("../../definitions/schemas/schemas"));
const updateSchema = {
    username: Object.assign(Object.assign({}, schemas_1.default.username), { attributes: Object.assign(Object.assign({}, schemas_1.default.username.attributes), { required: false }) }),
    code: Object.assign(Object.assign({}, schemas_1.default.otp), { attributes: Object.assign(Object.assign({}, schemas_1.default.otp.attributes), { required: false }) })
};
exports.default = updateSchema;
