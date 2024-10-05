"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
const secret = crypto_1.default.randomBytes(64).toString('hex');
const appName = `dharrsnprojects`;
const config = {
    APPNAME: appName,
    APPURL: process.env[`${appName.toUpperCase()}_URL`] || `${appName}.com`,
    SERVER_SECRET: process.env[`${appName.toUpperCase()}_SERVER_SECRET`] || secret,
    DATABASE_URL: process.env[`${appName.toUpperCase()}_DATABASE_URL`] || '',
    ENVIRONMENT: ((_a = process.env.NODE_ENV) === null || _a === void 0 ? void 0 : _a.toUpperCase()) || 'DEVELOPMENT',
    SOCKET_CONNECT_PRIVELEGE: ['guest', 'user', 'admin'],
    ROOT_DIR: path_1.default.normalize(__dirname + `/../../`),
    PORT: process.env[`${appName.toUpperCase()}_PORT`] || 3000,
    ROOT_URL: '/',
    ERROR_URL: '/error',
    NODEMAILER: {
        EMAIL: process.env[`${appName.toUpperCase()}_NODEMAILER_EMAIL`] || '',
        PASSWORD: process.env[`${appName.toUpperCase()}_NODEMAILER_PASSWORD`] || ''
    },
    ADMIN_EMAIL: process.env[`${appName.toUpperCase()}_ADMIN_EMAIL`] || '',
    MAX_HD_SIZE_GB: process.env[`${appName.toUpperCase()}_MAX_HD_SIZE_GB`] || 20,
    REPOSITORY: {
        URL: process.env[`${appName.toUpperCase()}_REPO_URL`],
        BRANCH: process.env[`${appName.toUpperCase()}_REPO_BRANCH`] || 'main',
        PAT: process.env[`${appName.toUpperCase()}_REPO_PAT`],
        SECRET: process.env[`${appName.toUpperCase()}_REPO_SECRET`]
    }
};
exports.default = config;
