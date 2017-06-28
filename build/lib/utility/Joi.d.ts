import * as joi from "joi";
import * as Bluebird from "Bluebird";
import {ValidationOptions} from "joi";

export declare function joiValidate<T>(value: Object, schema: Object, options: ValidationOptions): Bluebird<T>