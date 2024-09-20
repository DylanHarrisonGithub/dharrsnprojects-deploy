"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const schemas_1 = __importDefault(require("../../definitions/schemas/schemas"));
const projectStreamSchema = {
    afterID: schemas_1.default.id,
    numrows: { type: 'string | number', attributes: { required: true, range: { min: 0, max: 50 } } },
    search: Object.assign(Object.assign({}, schemas_1.default.dbSafeString), { attributes: Object.assign(Object.assign({}, schemas_1.default.dbSafeString.attributes), { required: false }) }),
    id: Object.assign(Object.assign({}, schemas_1.default.id), { attributes: Object.assign(Object.assign({}, schemas_1.default.id.attributes), { required: false }) })
};
exports.default = projectStreamSchema;
