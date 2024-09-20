"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_service_1 = __importDefault(require("../../services/db/db.service"));
const email_service_1 = __importDefault(require("../../services/email/email.service"));
const contact_template_1 = __importDefault(require("../../email-templates/contact.template"));
const data_1 = require("../../definitions/data/data");
const config_1 = __importDefault(require("../../config/config"));
const { periods, weekdays, months, daysPerMonth, years, dates, times } = data_1.timeData;
exports.default = async (request) => {
    var _a, _b;
    let dateObj = new Date();
    let month = dateObj.toLocaleString('default', { month: 'long' });
    let day = dateObj.getUTCDate();
    let year = dateObj.getUTCFullYear();
    const contact = {
        email: request.params.email,
        subject: request.params.subject || '',
        message: request.params.message,
        timestamp: Date.now(),
        search: `${month}/${day}/${year}${month}-${day}-${year}${data_1.timeData.months.indexOf(month) + 1}/${day}/${year}${data_1.timeData.months.indexOf(month) + 1}-${day}-${year}${month}/${day.toString().padStart(2, '0')}/${year}${month}-${day.toString().padStart(2, '0')}-${year}${(data_1.timeData.months.indexOf(month) + 1).toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}${(data_1.timeData.months.indexOf(month) + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}-${year}${request.params.email}${request.params.subject}${request.params.message}`
    };
    const dbRes = await db_service_1.default.row.create('contact', contact);
    if (dbRes.success) {
        const emailRes = await (0, email_service_1.default)(config_1.default.ADMIN_EMAIL || config_1.default.NODEMAILER.EMAIL, `New contact from ${contact.email}`, undefined, 
        // `
        //   <table>
        //     <tr>
        //       <td>Contact ID:</td>
        //       <td>${dbRes.body?.id || 'no id'}</td>
        //     </tr>
        //     <tr>
        //       <td>From: </td>
        //       <td>${contact.email}</td>
        //     </tr>
        //     <tr>
        //       <td>Contact date:</td>
        //       <td>${month}/${day}/${year}</td>
        //     </tr>
        //     <tr>
        //       <td>Subject:</td>
        //       <td>${contact.subject}</td>
        //     </tr>
        //     <tr>
        //       <td>Message:</td>
        //       <td>${contact.message}</td>
        //     </tr>
        //   </table>
        //   <p>Pleave visit <a href="${
        //     config.ENVIRONMENT === 'DEVELOPMENT' ? 
        //       `http://localhost:4200` 
        //     : 
        //       `https://${request.host}`
        //     }/admin/contacts/${dbRes.body?.id || ''
        //   }">here</a> to view or delete this contact message.</p>
        // `
        (0, contact_template_1.default)(((_a = dbRes.body) === null || _a === void 0 ? void 0 : _a.id.toString()) || 'no id', contact.email, month, day.toString(), year.toString(), contact.subject, contact.message, config_1.default.ENVIRONMENT === 'DEVELOPMENT' ?
            `http://localhost:4200`
            :
                `https://${request.host}
          }/admin/contacts/${((_b = dbRes.body) === null || _b === void 0 ? void 0 : _b.id) || ''}`));
        return new Promise(res => res({
            code: 200,
            json: {
                success: true,
                messages: [
                    `SERVER - ROUTES - CONTACTCREATE - New contact ${dbRes.body.id} created.`
                ].concat(dbRes.messages).concat(emailRes.messages),
                body: { contact: dbRes.body }
            }
        }));
    }
    else {
        return new Promise(res => res({
            code: 500,
            json: {
                success: false,
                messages: [
                    `SERVER - ROUTES - CONTACTCREATE - New contact could not be created.`
                ].concat(dbRes.messages),
                body: { contact: request.params }
            }
        }));
    }
};
