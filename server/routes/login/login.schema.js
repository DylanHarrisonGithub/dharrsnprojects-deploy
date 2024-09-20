"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../../definitions/models/User/User"));
const loginSchema = Object.assign({}, (({ username, password }) => ({ username, password }))(User_1.default.schema));
exports.default = loginSchema;
