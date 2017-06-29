import * as joi from "joi";
import * as Bluebird from "Bluebird";
import {ValidationOptions} from "joi";

let joiValidate = Bluebird.promisify(joi.validate) as {
    <T>(value: Object, schema: Object, options: ValidationOptions): Bluebird<T>
};
export {joi, joiValidate};