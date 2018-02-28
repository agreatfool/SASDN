import * as joi from 'joi';
import * as util from 'util';

let joiValidate = util.promisify(joi.validate) as {
  <T>(value: Object, schema: Object, options: joi.ValidationOptions): Promise<T>
};

export { joi, joiValidate };