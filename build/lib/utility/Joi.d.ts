/// <reference types="bluebird" />
import * as joi from "joi";
import * as bluebird from "bluebird";
declare let joiValidate: <T>(value: Object, schema: Object, options: joi.ValidationOptions) => bluebird<T>;
export { joi, joiValidate };
