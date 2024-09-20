"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../../definitions/models/User/User"));
const schemas_1 = __importDefault(require("../../definitions/schemas/schemas"));
const registerSchema = Object.assign(Object.assign({ admin: schemas_1.default.username }, (({ username, password, email, avatar }) => ({ username, password, email, avatar }))(User_1.default.schema)), { code: User_1.default.schema.otp });
exports.default = registerSchema;
