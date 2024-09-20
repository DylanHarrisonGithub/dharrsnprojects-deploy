"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const schemas_1 = __importDefault(require("../../schemas/schemas"));
const MailModel = {
    db: {
        id: `SERIAL`,
        email: `TEXT`,
        code: `TEXT`,
        salt: `TEXT`,
        verified: `TEXT`,
        PRIMARY: `KEY (id)`
    },
    schema: {
        email: schemas_1.default.email
    }
};
exports.default = MailModel;
