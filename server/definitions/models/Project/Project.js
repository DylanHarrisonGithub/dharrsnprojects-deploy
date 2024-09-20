"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const schemas_1 = __importDefault(require("../../schemas/schemas"));
const ProjectModel = {
    db: {
        id: `SERIAL`,
        thumbnail: `TEXT`,
        title: `TEXT`,
        links: `TEXT`,
        technologies: `TEXT`,
        features: `TEXT`,
        description: `TEXT`,
        media: `TEXT`,
        projectType: `TEXT`,
        search: `TEXT`,
        PRIMARY: `KEY (id)`,
    },
    schema: {
        id: schemas_1.default.id,
        afterID: schemas_1.default.id,
        thumbnail: schemas_1.default.imageFilename,
        title: schemas_1.default.sentence,
        links: { type: 'string', attributes: { required: true, array: { minLength: 0 } } },
        technologies: Object.assign(Object.assign({}, schemas_1.default.sentence), { attributes: Object.assign(Object.assign({}, schemas_1.default.sentence.attributes), { array: { minLength: 0 } }) }),
        features: Object.assign(Object.assign({}, schemas_1.default.sentence), { attributes: Object.assign(Object.assign({}, schemas_1.default.sentence.attributes), { array: { minLength: 0 } }) }),
        description: schemas_1.default.paragraph,
        media: { type: 'string', attributes: { required: true, array: { minLength: 0 } } },
        projectType: { type: ['app', 'demo', 'webapp'], attributes: { required: true } },
        search: Object.assign(Object.assign({}, schemas_1.default.dbSafeString), { attributes: Object.assign(Object.assign({}, schemas_1.default.dbSafeString.attributes), { required: false }) }),
    }
};
exports.default = ProjectModel;
