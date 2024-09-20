"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COMMON_REGEXES = void 0;
exports.COMMON_REGEXES = {
    EMAIL: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    ALPHA: /^[a-zA-Z]*$/,
    NUMERIC: /^[0-9]*$/,
    ALPHA_NUMERIC: /^[a-zA-Z0-9]*$/,
    ALPHA_NUMERIC_SPACES: /^[a-zA-Z0-9 ]*$/,
    COMMON_WRITING: /^[A-Za-z0-9\s\r\n.,!?'"()\-]*$/,
    PASSWORD_STRONGEST: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[-+_!@#$%^&*.,?])/
};
const validation2 = (() => {
    const service = (input, schema) => {
        const validateLeafNode = (input, schema, key, root) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            let errors = [];
            // reject leaf node inputs that do not match specified type
            if ((typeof schema[key].type === 'string' && !(schema[key].type.includes(typeof input))) ||
                (schema[key].type instanceof RegExp && !(typeof input === 'string')) ||
                (Array.isArray(schema[key].type) && !(schema[key].type.includes(input)))) {
                return [key + ' does not match specified type.']; // no further testing can safely be made
            }
            // inputs that match schema type are assumed to have only schema attributes 
            // that make sense for that specified type
            // regex test
            if ((schema[key].type instanceof RegExp) && !(schema[key].type.test(input))) {
                errors.push(key + ` does not match specified format.`);
            }
            // string length tests
            if ((_b = (_a = schema[key].attributes) === null || _a === void 0 ? void 0 : _a.strLength) === null || _b === void 0 ? void 0 : _b.hasOwnProperty('minLength')) {
                if (input.length < schema[key].attributes.strLength.minLength) {
                    errors.push(key + ` does not meet minimum specified length.`);
                }
            }
            if ((_d = (_c = schema[key].attributes) === null || _c === void 0 ? void 0 : _c.strLength) === null || _d === void 0 ? void 0 : _d.hasOwnProperty('maxLength')) {
                if (input.length > schema[key].attributes.strLength.maxLength) {
                    errors.push(key + ` exceeds minimum specified length.`);
                }
            }
            // number or string range tests
            if ((_f = (_e = schema[key].attributes) === null || _e === void 0 ? void 0 : _e.range) === null || _f === void 0 ? void 0 : _f.hasOwnProperty('min')) {
                if (input < schema[key].attributes.range.min) {
                    errors.push(key + ` is below specified range minimum.`);
                }
            }
            if ((_h = (_g = schema[key].attributes) === null || _g === void 0 ? void 0 : _g.range) === null || _h === void 0 ? void 0 : _h.hasOwnProperty('max')) {
                if (input > schema[key].attributes.range.max) {
                    errors.push(key + ` is above specified range maximum.`);
                }
            }
            // custom tests
            (_k = (_j = schema[key].attributes) === null || _j === void 0 ? void 0 : _j.tests) === null || _k === void 0 ? void 0 : _k.forEach((test) => {
                let res = test(root, input);
                if (!res.success) {
                    errors.push(key + ` ` + (res.message || ` failed custom test.`));
                }
            });
            console.log(errors);
            return errors;
        };
        const validateNode = (input, schema, root) => Object.keys(schema).reduce((errors, key) => {
            var _a, _b, _c, _d, _e, _f;
            // if input does not have key
            if (!(input.hasOwnProperty(key) && !(input[key] === undefined || input[key] === null))) {
                if ((_a = schema[key].attributes) === null || _a === void 0 ? void 0 : _a.required) {
                    errors.push(key + ' is required.');
                }
                return errors;
            }
            // reject array inputs that are not supposed to be arrays
            // reject inputs that are supposed to be arrays, but are not
            if (Array.isArray(input[key]) != !!((_b = schema[key].attributes) === null || _b === void 0 ? void 0 : _b.array)) {
                errors.push(key + ' does not match specified type.');
                return errors;
            }
            // reject array inputs that violate array length bounds
            if (Array.isArray(input[key])) {
                if (((_d = (_c = schema[key].attributes) === null || _c === void 0 ? void 0 : _c.array) === null || _d === void 0 ? void 0 : _d.hasOwnProperty('minLength')) && (input[key].length < schema[key].attributes.array.minLength)) {
                    errors.push(key + ' does not meet the specified minimum array length.'); // subceeds
                }
                if (((_f = (_e = schema[key].attributes) === null || _e === void 0 ? void 0 : _e.array) === null || _f === void 0 ? void 0 : _f.hasOwnProperty('maxLength')) && (input[key].length > schema[key].attributes.array.maxLength)) {
                    errors.push(key + ' exceeds specified maximum array length.');
                }
                return errors;
            }
            // type is nested schema
            if (typeof schema[key].type === 'object' && !(schema[key].type instanceof RegExp || Array.isArray(schema[key].type))) {
                if (Array.isArray(input[key])) {
                    errors = errors.concat(input[key].reduce((errors2, item) => errors2.concat(validateNode(item, (schema[key].type), root)), []));
                }
                else {
                    errors = errors.concat(validateNode(input[key], (schema[key].type), root));
                }
                return errors;
            }
            // type is leaf node or array of leaf nodes
            if (Array.isArray(input[key])) {
                errors = errors.concat(input[key].reduce((errors2, item) => errors2.concat(validateLeafNode(item, schema, key, root), [])));
            }
            else {
                errors = errors.concat(validateLeafNode(input[key], schema, key, root));
            }
            return errors;
        }, []);
        const errors = validateNode(input, schema, input);
        return new Promise((resolve => resolve({
            success: !(errors.length),
            messages: [
                errors.length ?
                    `Server - Services - Validation - Validation failed for input.`
                    :
                        `Server - Services - Validation - Input successfully validated.`
            ],
            body: errors
        })));
    };
    return service;
})();
exports.default = validation2;
