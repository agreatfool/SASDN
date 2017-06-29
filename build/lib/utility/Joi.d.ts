/// <reference types="bluebird" />
import * as joi from "joi";
import * as Bluebird from "Bluebird";
declare let joiValidate: <T>(value: Object, schema: Object, options: joi.ValidationOptions) => Bluebird<T>;
export { joi, joiValidate };
