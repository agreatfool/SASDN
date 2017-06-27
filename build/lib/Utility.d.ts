import { ValidationOptions, ValidationResult } from "joi";

export declare function joiValidate<T>(value: T, schema: Object, options: ValidationOptions): Promise<ValidationResult<T>>