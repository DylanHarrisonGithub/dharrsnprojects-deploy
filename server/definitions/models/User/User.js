"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const schemas_1 = __importDefault(require("../../schemas/schemas"));
const UserModel = {
    db: {
        id: `SERIAL`,
        username: 'TEXT',
        email: `TEXT`,
        password: 'TEXT',
        salt: 'TEXT',
        privilege: `TEXT`,
        avatar: `TEXT`,
        reset: `TEXT`,
        resetstamp: `TEXT`,
        tries: `NUMERIC`,
        PRIMARY: 'KEY (username)'
    },
    schema: Object.assign(Object.assign({}, (({ id, username, email, password, otp, privilege }) => ({ id, username, email, password, otp, privilege }))(schemas_1.default)), { avatar: schemas_1.default.imageFilename }),
};
const map = (user) => ({
    id: `SERIAL`,
    username: 'TEXT',
    email: `TEXT`,
    password: 'TEXT',
    salt: 'TEXT',
    privilege: `TEXT`,
    avatar: `TEXT`,
    reset: `TEXT`,
    resetstamp: `TEXT`,
    tries: `NUMERIC`,
    PRIMARY: 'KEY (username)'
});
exports.default = UserModel;
