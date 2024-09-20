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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const exec = __importStar(require("child_process"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const server_1 = __importDefault(require("./server/server"));
const db_service_1 = __importDefault(require("./server/services/db/db.service"));
const config_1 = __importDefault(require("./server/config/config"));
const file_service_1 = __importDefault(require("./server/services/file/file.service"));
const crypto_1 = __importDefault(require("crypto"));
const email_service_1 = __importDefault(require("./server/services/email/email.service"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ credentials: true }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, express_fileupload_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api', async (request, response) => {
    var _a;
    let parsedRequest = await server_1.default.services.requestParser(request);
    if (parsedRequest.success && parsedRequest.body) {
        let routerResponse = await server_1.default.services.router(parsedRequest.body);
        let res = routerResponse.body;
        Object.keys(res.headers || {}).forEach(key => response.setHeader(key, res.headers[key]));
        console.log([
            `ip: ${parsedRequest.body.ip}`,
            `timestamp: ${parsedRequest.body.timestamp}`,
            `route: ${parsedRequest.body.route}`,
            ...parsedRequest.messages,
            ...(((_a = res.json) === null || _a === void 0 ? void 0 : _a.messages) || routerResponse.messages)
        ]);
        if (res.json) {
            //res.json.messages = [...res.json.messages, ... parsedRequest.messages];
            response.status(res.code).json(res.json);
        }
        else if (res.html) {
            response.status(res.code).send(res.html);
        }
        else if (res.filename) {
            response.status(res.code).sendFile(res.filename);
        }
        else if (res.redirect) {
            response.redirect(res.redirect);
        }
        else {
            response.sendStatus(res.code);
        }
    }
    else {
        console.log(parsedRequest.messages);
        response.status(400).json({
            success: false,
            messages: [...parsedRequest.messages]
        });
    }
});
app.use('/public', express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use(express_1.default.static(path_1.default.join(__dirname, 'client')));
app.get('/*', (req, res) => res.sendFile(path_1.default.resolve(__dirname, './client', 'index.html')));
app.listen(config_1.default.PORT || 3000, async () => {
    // full db delete
    // for (const key of Object.keys(server.models)) {
    //   console.log((await db.table.delete(key)).messages);
    // }
    var _a;
    // //!!!! uncomment before deploying !!!!
    // create db tables if they don't already exist
    for (const key of Object.keys(server_1.default.models)) {
        console.log((await db_service_1.default.table.create(key, server_1.default.models[key].db)).messages);
    }
    // add any missing columns to tables
    let dbtable;
    for (const key of Object.keys(server_1.default.models)) {
        dbtable = (await db_service_1.default.table.read(key)).body;
        if (dbtable) {
            let _b = server_1.default.models[key].db, { PRIMARY } = _b, tabledef = __rest(_b, ["PRIMARY"]);
            for (const tdcolumn of Object.keys(tabledef)) {
                if (!dbtable.filter(dbv => dbv.column_name.toLowerCase() === tdcolumn.toLowerCase()).length) {
                    console.log(`Warning: database definition for table ${key} is missing column ${tdcolumn} as defined by this application for ${key} table!`);
                    console.log(`Adding column ${tdcolumn} to table ${key} as defined by this application..`);
                    let res = await db_service_1.default.table.update(key, { add: { [tdcolumn]: tabledef[tdcolumn] } });
                    console.log('here is the result of that..', res.messages);
                }
            }
        }
    }
    // create a default admin user if none exist
    const userRes = await db_service_1.default.row.read('user');
    if (!((_a = userRes.body) === null || _a === void 0 ? void 0 : _a.length)) {
        const admin = {
            username: 'admin' + Math.random().toString(36).slice(2),
            email: config_1.default.ADMIN_EMAIL,
            password: 'p' + Math.random().toString(36).slice(2),
        };
        const salt = crypto_1.default.randomBytes(32).toString('hex');
        const hash = await crypto_1.default.pbkdf2Sync(admin.password, salt, 32, 64, 'sha512').toString('hex');
        const res = await db_service_1.default.row.create('user', {
            username: admin.username,
            email: admin.email,
            privilege: 'user',
            password: hash,
            salt: salt,
            avatar: ``,
            reset: ``,
            resetstamp: `0`,
            tries: 0
        });
        if (res.success) {
            console.log('Temporary admin account created');
            console.log(admin);
            console.log('Please use this account to register a permanent admin account and then delete the temporary one.');
            (0, email_service_1.default)(admin.email, 'Temporary Login', `${JSON.stringify(admin)}`);
        }
        else {
            console.log('Error: Failed to create temporary admin account');
            console.log('Failed attempt produced the following message(s)');
            console.log(res.messages);
        }
    }
    if (config_1.default.REPOSITORY.URL) {
        try {
            const res = exec.execSync(`sudo git remote set-url origin https://${config_1.default.REPOSITORY.PAT ? config_1.default.REPOSITORY.PAT + '@' : ''}${config_1.default.REPOSITORY.URL}`);
        }
        catch (e) {
            console.log(['failed to set git remote url', e]);
        }
    }
    console.log('root dir: ', config_1.default.ROOT_DIR);
    console.log('root size: ', await file_service_1.default.getDirectorySize(''));
    console.log('db connection string: ' + config_1.default.DATABASE_URL);
    console.log('host: ' + os_1.default.hostname());
    console.log(`${config_1.default.APPNAME} listening on port ${config_1.default.PORT || 3000}`);
});
