"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const joi = require("joi");
exports.joi = joi;
const bluebird = require("bluebird");
let joiValidate = bluebird.promisify(joi.validate);
exports.joiValidate = joiValidate;
//# sourceMappingURL=Joi.js.map