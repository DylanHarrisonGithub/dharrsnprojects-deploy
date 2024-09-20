"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const schemas_1 = __importDefault(require("../../definitions/schemas/schemas"));
const mailGenCodeSchema = {
    email: schemas_1.default.email
};
exports.default = mailGenCodeSchema;
