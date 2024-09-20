"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Contact_1 = __importDefault(require("../../definitions/models/Contact/Contact"));
const contactCreateSchema = Object.assign({}, (({ email, subject, message }) => ({ email, subject, message }))(Contact_1.default.schema));
exports.default = contactCreateSchema;
