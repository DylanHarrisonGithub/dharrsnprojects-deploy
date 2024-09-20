"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Project_1 = __importDefault(require("../../definitions/models/Project/Project"));
const projectCreateSchema = Object.assign({}, (({ thumbnail, title, links, technologies, features, description, media, projectType }) => ({ thumbnail, title, links, technologies, features, description, media, projectType }))(Project_1.default.schema));
exports.default = projectCreateSchema;
