"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = __importDefault(require("pg"));
const config_1 = __importDefault(require("../../config/config"));
const quoteString = (val) => (typeof val === 'string') ? "'" + escape(val) + "'" : val;
const escape = (v) => v.replace(/'/g, `''`);
const unescape = (v) => v.replace(/''/g, `'`);
const unescapeRows = (rows) => rows.map(row => Object.keys(row).reduce((acc, key) => typeof row[key] === 'string' ? Object.assign({ [key]: unescape(row[key]) }, acc) : Object.assign({ [key]: row[key] }, acc), {}));
const db = (() => {
    const service = {
        row: {
            create: async (table, row) => {
                const client = new pg_1.default.Client({ connectionString: config_1.default.DATABASE_URL, ssl: { rejectUnauthorized: false } });
                const query = `INSERT INTO "${table}" (${Object.keys(row).map((key, index) => index !== Object.keys(row).length - 1 ? key + ', ' : key).join("")}) VALUES (${Object.keys(row).map((key, index) => index !== Object.keys(row).length - 1 ? quoteString(row[key]) + ', ' : quoteString(row[key])).join("")}) RETURNING *;`;
                try {
                    await client.connect();
                    const result = ((await client.query(query)).rows[0]);
                    await client.end();
                    return {
                        success: true,
                        messages: [
                            `SERVER - DBService - Row - Create - Successfully inserted into table ${table}.`,
                            `SERVER - DBService - Row - Create - Query: ${query}`
                        ],
                        body: result
                    };
                }
                catch (error) {
                    await client.end();
                    return {
                        success: false,
                        messages: [
                            `SERVER - DBService - Row - Create - Error attempting to insert row into table ${table}.`,
                            `SERVER - DBService - Row - Create - Query: ${query}`
                        ].concat(error.stack)
                    };
                }
            },
            read: async (table, where) => {
                const client = new pg_1.default.Client({ connectionString: config_1.default.DATABASE_URL, ssl: { rejectUnauthorized: false } });
                const query = `SELECT * FROM "${table}"${(where && Object.keys(where).length) ?
                    ` WHERE ` +
                        Object.keys(where).map((key, index) => index !== Object.keys(where).length - 1 ?
                            key + ` = ` + quoteString(where[key]) + ` AND `
                            :
                                key + ` = ` + quoteString(where[key])).join("")
                    : ``};`;
                try {
                    await client.connect();
                    const result = unescapeRows((await client.query(query)).rows);
                    await client.end();
                    return {
                        success: true,
                        messages: [
                            `SERVER - DBService - Row - Read - Rows successfully selected from table ${table}.`,
                            `SERVER - DBService - Row - Read - Query: ${query}`
                        ],
                        body: result
                    };
                }
                catch (error) {
                    await client.end();
                    return {
                        success: false,
                        messages: [
                            `SERVER - DBService - Row - Read - Error attempting to select from table ${table}.`,
                            `SERVER - DBService - Row - Read - Query: ${query}`
                        ].concat(error.stack)
                    };
                }
            },
            stream: async (table, afterID, numrows, where) => {
                const client = new pg_1.default.Client({ connectionString: config_1.default.DATABASE_URL, ssl: { rejectUnauthorized: false } });
                const query = `SELECT * FROM "${table}" WHERE id > ${afterID}${(where && Object.keys(where).length) ?
                    ` AND ` +
                        Object.keys(where).map((key, index) => index !== Object.keys(where).length - 1 ?
                            key + ` = ` + quoteString(where[key]) + ` AND `
                            :
                                key + ` = ` + quoteString(where[key])).join("")
                    : ``} ORDER BY id ASC LIMIT ${numrows};`;
                try {
                    await client.connect();
                    const result = unescapeRows((await client.query(query)).rows);
                    await client.end();
                    return {
                        success: true,
                        messages: [
                            `SERVER - DBService - Row - Stream - Rows successfully streamed from table ${table}.`,
                            `SERVER - DBService - Row - Stream - Query: ${query}`
                        ],
                        body: result
                    };
                }
                catch (error) {
                    await client.end();
                    return {
                        success: false,
                        messages: [
                            `SERVER - DBService - Row - Stream - Error attempting to stream from table ${table}.`,
                            `SERVER - DBService - Row - Stream - Query: ${query}`
                        ].concat(error.stack)
                    };
                }
            },
            update: async (table, columns, where) => {
                const client = new pg_1.default.Client({ connectionString: config_1.default.DATABASE_URL, ssl: { rejectUnauthorized: false } });
                const query = `UPDATE "${table}" SET ${Object.keys(columns).map((key, index) => index !== Object.keys(columns).length - 1 ?
                    key + ` = ` + quoteString(columns[key]) + `, `
                    :
                        key + ` = ` + quoteString(columns[key])).join("")} ${(where && Object.keys(where).length) ?
                    `WHERE ` +
                        Object.keys(where).map((key, index) => index !== Object.keys(where).length - 1 ?
                            key + ` = ` + quoteString(where[key]) + ` AND `
                            :
                                key + ` = ` + quoteString(where[key])).join("")
                    : ``};`;
                if (!(Object.keys(columns).length)) {
                    return {
                        success: false,
                        messages: [
                            `SERVER - DBService - Row - Update - No updates were provided for table ${table}.`,
                            `SERVER - DBService - Row - Update - Query: ${query}`
                        ]
                    };
                }
                try {
                    await client.connect();
                    const result = (unescapeRows((await client.query(query)).rows)[0]);
                    await client.end();
                    return {
                        success: true,
                        messages: [
                            `SERVER - DBService - Row - Update - Row(s) successfully updated in table ${table}.`,
                            `SERVER - DBService - Row - Update - Query: ${query}`
                        ],
                        body: result
                    };
                }
                catch (error) {
                    await client.end();
                    return {
                        success: false,
                        messages: [
                            `SERVER - DBService - Row - Update - Error attempting to update row(s) in table ${table}.`,
                            `SERVER - DBService - Row - Update - Query: ${query}`
                        ].concat(error.stack)
                    };
                }
            },
            delete: async (table, where) => {
                const client = new pg_1.default.Client({ connectionString: config_1.default.DATABASE_URL, ssl: { rejectUnauthorized: false } });
                const query = `DELETE FROM "${table}"${(where && Object.keys(where).length) ?
                    ` WHERE ` +
                        Object.keys(where).map((key, index) => index !== Object.keys(where).length - 1 ?
                            key + ` = ` + quoteString(where[key]) + ` AND `
                            :
                                key + ` = ` + quoteString(where[key])).join("")
                    : ``};`;
                try {
                    await client.connect();
                    await client.query(query);
                    await client.end();
                    return {
                        success: true,
                        messages: [
                            `SERVER - DBService - Row - Delete - Row(s) successfully deleted in table ${table}.`,
                            `SERVER - DBService - Row - Delete - Query: ${query}`
                        ]
                    };
                }
                catch (error) {
                    await client.end();
                    return {
                        success: false,
                        messages: [
                            `SERVER - DBService - Row - Delete - Error attempting to delete row(s) in table ${table}.`,
                            `SERVER - DBService - Row - Delete - Query: ${query}`
                        ].concat(error.stack)
                    };
                }
            },
            query: async (query) => {
                const client = new pg_1.default.Client({ connectionString: config_1.default.DATABASE_URL, ssl: { rejectUnauthorized: false } });
                try {
                    await client.connect();
                    const result = unescapeRows((await client.query(query)).rows);
                    await client.end();
                    return {
                        success: true,
                        messages: [
                            `SERVER - DBService - Row - Query - Query successfully executed.`,
                            `SERVER - DBService - Row - Query - Query: ${query}`
                        ],
                        body: result
                    };
                }
                catch (error) {
                    return {
                        success: false,
                        messages: [
                            `SERVER - DBService - Row - Query - Query did not execute successfully.`,
                            `SERVER - DBService - Row - Query - Query: ${query}`
                        ].concat(error.stack)
                    };
                }
            }
        },
        table: {
            create: async (table, columns) => {
                const client = new pg_1.default.Client({ connectionString: config_1.default.DATABASE_URL, ssl: { rejectUnauthorized: false } });
                const query = `CREATE TABLE IF NOT EXISTS "${table}" (${Object.keys(columns).map((key, index) => `\n  ${key} ${columns[key]}`) // (index !== Object.keys(columns).length -1 ? ',' : '')}`)
                }\n);`;
                try {
                    await client.connect();
                    const result = (await client.query(query)).rows;
                    await client.end();
                    return {
                        success: true,
                        messages: [
                            `SERVER - DBService - Table - Create - Table ${table} successfully created.`,
                            `SERVER - DBService - Table - Create - Query: ${query}`
                        ],
                        body: result
                    };
                }
                catch (error) {
                    await client.end();
                    return {
                        success: false,
                        messages: [
                            `SERVER - DBService - Table - Create - Error attempting to create table ${table}.`,
                            `SERVER - DBService - Table - Create - Query: ${query}`
                        ].concat(error.stack)
                    };
                }
            },
            read: async (table) => {
                const client = new pg_1.default.Client({ connectionString: config_1.default.DATABASE_URL, ssl: { rejectUnauthorized: false } });
                const query = table ?
                    `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '${table}';`
                    :
                        `SELECT table_name FROM information_schema.tables WHERE table_type = 'BASE TABLE AND table_schema = 'public';`;
                try {
                    await client.connect();
                    const result = (await client.query(query)).rows;
                    await client.end();
                    return {
                        success: true,
                        messages: [
                            `SERVER - DBService - Table - Read - ` + (table ? `${table} read successfully.` : `Tables read successfully`),
                            `SERVER - DBService - Table - Read - Query: ${query}`
                        ],
                        body: result
                    };
                }
                catch (error) {
                    await client.end();
                    return {
                        success: false,
                        messages: [
                            `SERVER - DBService - Table - Read - ` + (table ? `Error attempting to read table ${table}.` : `Error attempting to read tables.`),
                            `SERVER - DBService - Table - Read - Query: ${query}`
                        ].concat(error.stack)
                    };
                }
            },
            update: async (table, updates) => {
                var _a;
                if (!(Object.keys(updates).length)) {
                    return {
                        success: true,
                        messages: [`SERVER - DBService - Table - Update - Warning attempting to update table ${table}. No updates were provided.`]
                    };
                }
                const client = new pg_1.default.Client({ connectionString: config_1.default.DATABASE_URL, ssl: { rejectUnauthorized: false } });
                const query = `ALTER TABLE "${table}"${Object.keys(updates.add || {}).map((column, i) => `\n  ADD "${column}" ${updates.add[column]}`)} ${((_a = updates.drop) === null || _a === void 0 ? void 0 : _a.map((column, i) => `\n  ADD DROP COLUMN "${column}"`)) || ""} ${Object.keys(updates.redefine || {}).map((column, i) => `\n  ALTER COLUMN "${column}" TYPE ${updates.redefine[column]}`)} ${Object.keys(updates.rename || {}).map((column, i) => `\n  RENAME COLUMN "${column}" TO ${updates.redefine[column]}`)};`;
                try {
                    await client.connect();
                    const result = (await client.query(query)).rows;
                    await client.end();
                    return {
                        success: true,
                        messages: [
                            `SERVER - DBService - Table - Update - Table ${table} successfully updated.`,
                            `SERVER - DBService - Table - Update - Query: ${query}`
                        ],
                        body: result
                    };
                }
                catch (error) {
                    await client.end();
                    return {
                        success: false,
                        messages: [
                            `SERVER - DBService - Table - Update - Error attempting to update table ${table}.`,
                            `SERVER - DBService - Table - Update - Query: ${query}`
                        ].concat(error.stack)
                    };
                }
            },
            delete: async (table) => {
                const client = new pg_1.default.Client({ connectionString: config_1.default.DATABASE_URL, ssl: { rejectUnauthorized: false } });
                const query = `DROP TABLE "${table}";`;
                try {
                    await client.connect();
                    const result = await client.query(query);
                    await client.end();
                    return {
                        success: true,
                        messages: [
                            `SERVER - DBService - Table - Delete - Table ${table} successfully deleted.`,
                            `SERVER - DBService - Table - Delete - Query: ${query}`
                        ],
                    };
                }
                catch (error) {
                    await client.end();
                    return {
                        success: false,
                        messages: [
                            `SERVER - DBService - Table - Delete - Error attempting to delete table ${table}.`,
                            `SERVER - DBService - Table - Delete - Query: ${query}`
                        ].concat(error.stack)
                    };
                }
            }
        }
    };
    return service;
})();
exports.default = db;
