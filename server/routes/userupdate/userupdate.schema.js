"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../../definitions/models/User/User"));
const userUpdateSchema = {
    id: User_1.default.schema.id,
    update: {
        type: {
            username: Object.assign(Object.assign({}, User_1.default.schema.username), { attributes: Object.assign(Object.assign({}, User_1.default.schema.username.attributes), { required: false }) }),
            avatar: Object.assign(Object.assign({}, User_1.default.schema.avatar), { attributes: Object.assign(Object.assign({}, User_1.default.schema.avatar.attributes), { required: false }) }),
            privilege: Object.assign(Object.assign({}, User_1.default.schema.privilege), { attributes: Object.assign(Object.assign({}, User_1.default.schema.privilege.attributes), { required: false }) }),
        },
        attributes: {
            required: false
        }
    }
};
exports.default = userUpdateSchema;
