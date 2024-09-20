"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("./User/User"));
const Mail_1 = __importDefault(require("./Mail/Mail"));
const Contact_1 = __importDefault(require("./Contact/Contact"));
const theme_1 = __importDefault(require("./Theme/theme"));
const Project_1 = __importDefault(require("./Project/Project"));
const unionRegex = (...regexes) => new RegExp(regexes.map(regex => regex.source).join("|"));
const ServerModels = {
    user: User_1.default,
    mail: Mail_1.default,
    contact: Contact_1.default,
    theme: theme_1.default,
    project: Project_1.default
};
exports.default = ServerModels;
