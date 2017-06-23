import * as joi from "joi"
import * as util from "util"

let joiValidate = util.promisify(joi.validate);

export {joi, joiValidate}