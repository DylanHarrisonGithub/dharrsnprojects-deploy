"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const schemas_1 = __importDefault(require("../../schemas/schemas"));
const ContactModel = {
    db: {
        id: `SERIAL`,
        timestamp: `NUMERIC`,
        email: `TEXT`,
        subject: `TEXT`,
        message: `TEXT`,
        search: `TEXT`,
        PRIMARY: `KEY (id)`,
    },
    schema: Object.assign(Object.assign({}, (({ id, email }) => ({ id, email }))(schemas_1.default)), { subject: schemas_1.default.sentence, message: schemas_1.default.paragraph, afterID: schemas_1.default.id, numrows: { type: 'string | number', attributes: { required: true, range: { min: 0, max: 255 } } }, search: Object.assign(Object.assign({}, schemas_1.default.dbSafeString), { attributes: Object.assign(Object.assign({}, schemas_1.default.dbSafeString.attributes), { required: false }) }) })
};
exports.default = ContactModel;
