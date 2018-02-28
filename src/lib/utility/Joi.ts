import * as joi from 'joi';
import * as LibUtil from 'util';

let joiValidate = LibUtil.promisify(joi.validate) as {
  <T>(value: Object, schema: Object, options: joi.ValidationOptions): Promise<T>
};

export { joi, joiValidate };