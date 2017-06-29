"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const joi = require("joi");
exports.joi = joi;
const Bluebird = require("Bluebird");
let joiValidate = Bluebird.promisify(joi.validate);
exports.joiValidate = joiValidate;
