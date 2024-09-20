"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultTheme = exports.dbTypes = exports.timeData = exports.acceptedMediaExtensions = void 0;
exports.acceptedMediaExtensions = {
    image: ['.gif', '.jpg', '.jpeg', '.png', '.heic'],
    video: ['.mov', '.mp4', '.mpeg', '.webm', '.ogg'],
    audio: ['.mp3', '.wav', '.ogg']
};
exports.timeData = {
    periods: ['Once', 'Daily', 'Weekly', 'BiWeekly', 'Monthly'],
    weekdays: [
        'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
    ],
    months: [
        'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
    ],
    daysPerMonth: [
        31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31
    ],
    years: [...[...Array(40).keys()].map(y => y + 2020)],
    dates: [...Array(32).keys()],
    times: [...[...Array(24).keys()].reduce((a, h) => [
            ...a,
            `${(h % 12 || 12).toString().padStart(2, '0')}:00${h < 12 ? 'am' : 'pm'}`,
            `${(h % 12 || 12).toString().padStart(2, '0')}:15${h < 12 ? 'am' : 'pm'}`,
            `${(h % 12 || 12).toString().padStart(2, '0')}:30${h < 12 ? 'am' : 'pm'}`,
            `${(h % 12 || 12).toString().padStart(2, '0')}:45${h < 12 ? 'am' : 'pm'}`,
        ], [])]
};
exports.dbTypes = [
    'BIGINT', 'BIGSERIAL', 'BIT', 'BIT VARYING', 'BOOLEAN', 'BOX', 'BYTEA', 'CHARACTER',
    'CHARACTER VARYING', 'CIDR', 'CIRCLE', 'DATE', 'DOUBLE PRECISION', 'INET', 'INTEGER',
    'INTERVAL', 'JSON', 'JSONB', 'LINE', 'LSEG', 'MACADDR', 'MACADDR8', 'MONEY', 'NUMERIC',
    'PATH', 'PG_LSN', 'POINT', 'POLYGON', 'REAL', 'SMALLINT', 'SMALLSERIAL', 'SERIAL',
    'TEXT', 'TIME', 'TIMESTAMP', 'TSQUERY', 'TSVECTOR', 'TXID_SNAPSHOT', 'UUID', 'XML'
];
exports.defaultTheme = { id: -1 };
