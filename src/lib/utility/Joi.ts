import * as joi from "joi";
import * as Bluebird from "Bluebird";

let joiValidate = Bluebird.promisify(joi.validate) as {
    <T>(value: Object, schema: Object, options: joi.ValidationOptions): Bluebird<T>
};
export {joi, joiValidate};