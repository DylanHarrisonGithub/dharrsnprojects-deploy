"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const schemas_1 = __importDefault(require("../../schemas/schemas"));
const ThemeModel = {
    db: {
        id: `SERIAL`,
        PRIMARY: `KEY (id)`
    },
    schema: {
        id: schemas_1.default.id
    }
};
exports.default = ThemeModel;
