import * as joi from "joi";
import * as util from "util";
import { ValidationOptions, ValidationResult } from "joi";

let joiValidate = util.promisify(joi.validate) as {
  <T>(value: T, schema: Object, options: ValidationOptions): Promise<ValidationResult<T>>
};

export {joi, joiValidate};