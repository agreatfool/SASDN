"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const joi = require("joi");
exports.joi = joi;
const bluebird = require("bluebird");
let joiValidate = bluebird.promisify(joi.validate);
exports.joiValidate = joiValidate;
const pbDoubleJoi = joi.extend((joi) => ({
    base: joi.number().greater(Number.MIN_SAFE_INTEGER).less(Number.MAX_SAFE_INTEGER),
    name: 'base'
}));
exports.pbDoubleJoi = pbDoubleJoi;
const pbFloatJoi = pbDoubleJoi;
exports.pbFloatJoi = pbFloatJoi;
const pbInt32Joi = joi.extend((joi) => ({
    base: joi.number().integer().greater(Number.MIN_SAFE_INTEGER).less(Number.MAX_SAFE_INTEGER),
    name: 'base'
}));
exports.pbInt32Joi = pbInt32Joi;
const pbSint32Joi = pbInt32Joi;
exports.pbSint32Joi = pbSint32Joi;
const pbSfixed32Joi = pbInt32Joi;
exports.pbSfixed32Joi = pbSfixed32Joi;
// todo int64 = long
const pbInt64Joi = pbInt32Joi;
exports.pbInt64Joi = pbInt64Joi;
const pbSint64Joi = pbInt64Joi;
exports.pbSint64Joi = pbSint64Joi;
const pbSfixed64Joi = pbInt64Joi;
exports.pbSfixed64Joi = pbSfixed64Joi;
const pbUint32Joi = joi.extend((joi) => ({
    base: joi.number().integer().positive().less(Number.MAX_SAFE_INTEGER),
    name: 'base'
}));
exports.pbUint32Joi = pbUint32Joi;
const pbFixed32Joi = pbUint32Joi;
exports.pbFixed32Joi = pbFixed32Joi;
const pbUint64Joi = pbUint32Joi;
exports.pbUint64Joi = pbUint64Joi;
const pbFixed64Joi = pbUint64Joi;
exports.pbFixed64Joi = pbFixed64Joi;
//# sourceMappingURL=Joi.js.map