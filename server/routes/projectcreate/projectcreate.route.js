"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_service_1 = __importDefault(require("../../services/db/db.service"));
const requestFilter = [
    'thumbnail',
    'title',
    'links',
    'technologies',
    'features',
    'description',
    'media',
    'projecttype'
];
exports.default = async (request) => {
    // precaution to filter any additional params that were provided with request
    const filteredProject = Object.assign(Object.assign({}, Object.fromEntries(Object.entries(request.params).filter(([key]) => requestFilter.includes(key)))), { search: `` });
    // assemble search string
    filteredProject.search = Object.keys(filteredProject).reduce((sum, key) => sum + JSON.stringify(filteredProject[key]), '');
    // flatten
    const flattenedProject = Object.keys(filteredProject).reduce((sum, key) => (Object.assign(Object.assign({}, sum), { [key]: JSON.stringify(filteredProject[key]) })), {});
    const dbres = await db_service_1.default.row.create('project', flattenedProject);
    return new Promise(resolve => resolve({
        code: dbres.success ? 200 : 400,
        json: {
            success: dbres.success,
            messages: dbres.messages
        }
    }));
};
