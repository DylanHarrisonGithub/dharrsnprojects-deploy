"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const validation_service_1 = require("../validation/validation.service");
const config_1 = __importDefault(require("../../config/config"));
const email = (() => {
    const service = async (recipient, subject, text, html) => {
        if (!(config_1.default.NODEMAILER.EMAIL && config_1.default.NODEMAILER.PASSWORD)) {
            return new Promise(res => res({
                success: false,
                messages: [`SERVER - Services - EmailService - Email not configured.`]
            }));
        }
        if (!validation_service_1.COMMON_REGEXES.EMAIL.test(recipient)) {
            return new Promise(res => res({
                success: false,
                messages: [`SERVER - Services - EmailService - Recipient email "${recipient}" is not a valid email address.`]
            }));
        }
        let mailOptions = {
            from: config_1.default.APPNAME,
            to: recipient,
            subject: subject ? subject : "no subject"
        };
        if (text) {
            mailOptions['text'] = text;
        }
        else if (!text && html) {
            mailOptions['html'] = html;
        }
        const result = await (nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: config_1.default.NODEMAILER.EMAIL,
                pass: config_1.default.NODEMAILER.PASSWORD
            }
        }).sendMail(mailOptions));
        if (result.rejected.length) {
            return new Promise(resolve => resolve({
                success: false,
                messages: [`SERVER - Services - EmailService - Email rejected.`],
                body: result
            }));
        }
        return new Promise(resolve => resolve({
            success: true,
            messages: [`SERVER - Services - EmailService - Email sent successfully.`],
            body: result
        }));
    };
    return service;
})();
exports.default = email;
