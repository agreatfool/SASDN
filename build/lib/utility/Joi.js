"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const joi = require("joi");
exports.joi = joi;
const LibUtil = require("util");
let joiValidate = LibUtil.promisify(joi.validate);
exports.joiValidate = joiValidate;
//# sourceMappingURL=Joi.js.map