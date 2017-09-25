import * as joi from 'joi';
import * as bluebird from 'bluebird';

let joiValidate = bluebird.promisify(joi.validate) as {
    <T>(value: Object, schema: Object, options: joi.ValidationOptions): bluebird<T>
};
export {joi, joiValidate};