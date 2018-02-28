"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const joi = require("joi");
exports.joi = joi;
const util = require("util");
let joiValidate = util.promisify(joi.validate);
exports.joiValidate = joiValidate;
//# sourceMappingURL=Joi.js.map