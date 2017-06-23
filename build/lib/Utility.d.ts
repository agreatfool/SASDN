import {
  AlternativesSchema,
  ArraySchema, BinarySchema, BooleanSchema, DateSchema, Extension, FunctionSchema, NumberSchema, ObjectSchema,
  Reference,
  ReferenceOptions,
  Schema, SchemaMap,
  StringSchema,
  ValidationError,
  ValidationOptions,
  ValidationResult, WhenOptions
} from "joi";

/**
 * Validates a value using the given schema and options.
 */
export declare function joiValidate<T>(value: T): ValidationResult<T>;
export declare function joiValidate<T, R>(value: T, callback: (err: ValidationError, value: T) => R): R;

export declare function joiValidate<T>(value: T, schema: Schema): ValidationResult<T>;
export declare function joiValidate<T>(value: T, schema: Object): ValidationResult<T>;
export declare function joiValidate<T, R>(value: T, schema: Schema, callback: (err: ValidationError, value: T) => R): R;
export declare function joiValidate<T, R>(value: T, schema: Object, callback: (err: ValidationError, value: T) => R): R;

export declare function joiValidate<T>(value: T, schema: Schema, options: ValidationOptions): ValidationResult<T>;
export declare function joiValidate<T>(value: T, schema: Object, options: ValidationOptions): ValidationResult<T>;
export declare function joiValidate<T, R>(value: T, schema: Schema, options: ValidationOptions, callback: (err: ValidationError, value: T) => R): R;
export declare function joiValidate<T, R>(value: T, schema: Object, options: ValidationOptions, callback: (err: ValidationError, value: T) => R): R;


export declare const joi: {
  array(): ArraySchema,
  any(): Schema,
  bool(): BooleanSchema,
  boolean(): BooleanSchema,
  binary(): BinarySchema,
  date(): DateSchema,
  func(): FunctionSchema,
  number(): NumberSchema,
  object(schema?: SchemaMap): ObjectSchema,
  string(): StringSchema,
  lazy(cb: () => Schema): Schema,

  alternatives(): AlternativesSchema,
  alternatives(types: Schema[]): AlternativesSchema,
  alternatives(type1: Schema, type2: Schema, ...types: Schema[]): AlternativesSchema,

  compile(schema: Object): Schema,
  assert(value: any, schema: Schema, message?: string | Error): void,
  attempt<T>(value: T, schema: Schema, message?: string | Error): T,
  ref(key: string, options?: ReferenceOptions): Reference,
  isRef(ref: any): boolean,
  reach(schema: Schema, path: string): Schema,
  extend(extention: Extension): any,

  allow(value: any, ...values: any[]): Schema,
  allow(values: any[]): Schema,
  valid(value: any, ...values: any[]): Schema,
  valid(values: any[]): Schema,
  only(value: any, ...values : any[]): Schema,
  only(values: any[]): Schema,
  equal(value: any, ...values : any[]): Schema,
  equal(values: any[]): Schema,
  invalid(value: any, ...values: any[]): Schema,
  invalid(values: any[]): Schema,
  disallow(value: any, ...values : any[]): Schema,
  disallow(values: any[]): Schema,
  not(value: any, ...values : any[]): Schema,
  not(values: any[]): Schema,
  required(): Schema,
  optional(): Schema,
  forbidden(): Schema,
  strip(): Schema,
  description(desc: string): Schema,
  notes(notes: string): Schema,
  notes(notes: string[]): Schema,
  tags(notes: string): Schema,
  tags(notes: string[]): Schema,
  meta(meta: Object): Schema,
  example(value: any): Schema,
  unit(name: string): Schema,
  options(options: ValidationOptions): Schema,
  strict(isStrict?: boolean): Schema,
  concat<T>(schema: T): T,
  when<U>(ref: string, options: WhenOptions<U>): AlternativesSchema,
  when<U>(ref: Reference, options: WhenOptions<U>): AlternativesSchema,
  label(name: string): Schema,
  raw(isRaw?: boolean): Schema,
  empty(schema?: any) : Schema,
};