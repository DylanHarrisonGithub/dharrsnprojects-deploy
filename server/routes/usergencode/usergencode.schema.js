"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../../definitions/models/User/User"));
const userGenCodeSchema = {
    username: User_1.default.schema.username
};
exports.default = userGenCodeSchema;
