"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const Path = __importStar(require("path"));
const config_1 = __importDefault(require("../../config/config"));
const parseErrorMessage = (fnName, e) => [
    `Server - Services - File - ${fnName}: ${e.toString() || `Error: ${e.name || ``} ${e.message || `Unknown error.`}`}`
];
const file = (() => {
    const service = {
        exists: async (filepath) => {
            try {
                await fs_1.promises.access(config_1.default.ROOT_DIR + filepath, fs_1.promises.constants.F_OK);
                return {
                    success: true,
                    messages: [
                        `Server - Services - File - Exists: Successfully ${filepath} verified to exist.`,
                    ]
                };
            }
            catch (e) {
                return {
                    success: false,
                    messages: [
                        `Server - Services - File - Exists: Error looking for ${filepath}`,
                        ...parseErrorMessage(`Exist`, e)
                    ]
                };
            }
        },
        create: async (filepath, content) => {
            try {
                await fs_1.promises.writeFile(config_1.default.ROOT_DIR + filepath, content);
                return {
                    success: true,
                    messages: [`Server - Services - File - Create: Successfully created ${filepath}`,]
                };
            }
            catch (e) {
                return {
                    success: false,
                    messages: [
                        `Server - Services - File - Create: Error creating ${filepath}`,
                        ...parseErrorMessage(`Create`, e)
                    ]
                };
            }
        },
        read: async (filepath) => {
            try {
                const contents = await fs_1.promises.readFile(config_1.default.ROOT_DIR + filepath, "utf8");
                return {
                    success: true,
                    messages: [`Server - Services - File - Read: Successfully read ${filepath}`,],
                    body: contents
                };
            }
            catch (e) {
                return {
                    success: false,
                    messages: [
                        `Server - Services - File - Read: Error reading ${filepath}`,
                        ...parseErrorMessage(`Read`, e)
                    ]
                };
            }
        },
        update: async (filepath, content) => {
            try {
                await fs_1.promises.appendFile(config_1.default.ROOT_DIR + filepath, content);
                return {
                    success: true,
                    messages: [`Server - Services - File - Update: Successfully updated ${filepath}.`,]
                };
            }
            catch (e) {
                return {
                    success: false,
                    messages: [
                        `Server - Services - File - Update: Error updating ${filepath}`,
                        ...parseErrorMessage(`Update`, e)
                    ]
                };
            }
        },
        delete: async (filepath) => {
            try {
                await fs_1.promises.unlink(config_1.default.ROOT_DIR + filepath);
                return {
                    success: true,
                    messages: [`Server - Services - File - Delete: Successfully deleted ${filepath}.`,]
                };
            }
            catch (e) {
                return {
                    success: false,
                    messages: [
                        `Server - Services - File - Delete: Error deleting ${filepath}.`,
                        ...parseErrorMessage(`Delete`, e)
                    ]
                };
            }
        },
        move: async (srcpath, destpath) => {
            try {
                await fs_1.promises.rename(config_1.default.ROOT_DIR + srcpath, config_1.default.ROOT_DIR + destpath);
                return {
                    success: true,
                    messages: [`Server - Services - File - Move: Successfully moved ${srcpath} to ${destpath}.`,]
                };
            }
            catch (e) {
                return {
                    success: false,
                    messages: [
                        `Server - Services - File - Move: Error moving ${srcpath} to ${destpath}.`,
                        ...parseErrorMessage(`Move`, e)
                    ]
                };
            }
        },
        readDirectory: async (path) => {
            try {
                const files = await fs_1.promises.readdir(config_1.default.ROOT_DIR + path);
                return {
                    success: true,
                    messages: [`Server - Services - File - ReadDirectory: Successfully read directory ${path}.`,],
                    body: files
                };
            }
            catch (e) {
                return {
                    success: false,
                    messages: [
                        `Server - Services - File - ReadDirectory: Error reading directory ${path}.`,
                        ...parseErrorMessage(`ReadDirectory`, e)
                    ]
                };
            }
        },
        createDirectory: async (path) => {
            try {
                await fs_1.promises.mkdir(config_1.default.ROOT_DIR + path, { recursive: true });
                return {
                    success: true,
                    messages: [`Server - Services - File - CreateDirectory: Successfully created directory ${path}.`,]
                };
            }
            catch (e) {
                return {
                    success: false,
                    messages: [
                        `Server - Services - File - CreateDirectory: Error creating directory ${path}.`,
                        ...parseErrorMessage(`CreateDirectory`, e)
                    ]
                };
            }
        },
        deleteDirectory: async (path) => {
            try {
                await fs_1.promises.rmdir(config_1.default.ROOT_DIR + path, { recursive: true });
                return {
                    success: true,
                    messages: [`Server - Services - File - DeleteDirectory: Successfully deleted directory ${path}.`,]
                };
            }
            catch (e) {
                return {
                    success: false,
                    messages: [
                        `Server - Services - File - DeleteDirectory: Error deleting directory ${path}.`,
                        ...parseErrorMessage(`DeleteDirectory`, e)
                    ]
                };
            }
        },
        getDirectorySize: async (path) => {
            try {
                const stats = await fs_1.promises.stat(config_1.default.ROOT_DIR + path);
                if (!stats.isDirectory()) {
                    return {
                        success: false,
                        messages: [
                            `Server - Services - File - GETDIRECTORYSIZE: ${path} is not a directory.`,
                        ]
                    };
                }
            }
            catch (_a) {
                return {
                    success: false,
                    messages: [
                        `Server - Services - File - GETDIRECTORYSIZE: ${config_1.default.ROOT_DIR + path} does not exist or is inaccessable.`,
                    ]
                };
            }
            let totalSize = 0;
            async function calculateSize(filePath) {
                const stats = await fs_1.promises.stat(filePath);
                if (stats.isFile()) {
                    totalSize += stats.size;
                }
                else if (stats.isDirectory()) {
                    const subFiles = await fs_1.promises.readdir(filePath);
                    for (const subFile of subFiles) {
                        await calculateSize(Path.join(filePath, subFile));
                    }
                }
            }
            await calculateSize(config_1.default.ROOT_DIR + path);
            return {
                success: true,
                messages: [
                    `Server - Services - File - GETDIRECTORYSIZE: ${path} size calculated successfully.`,
                ],
                body: totalSize
            };
        }
    };
    return service;
})();
exports.default = file;
