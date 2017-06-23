import * as EventEmitter from "events";
import {IServerCall, RpcImplCallback, Server, ServerCredentials} from "grpc";
import {
  ArraySchema, BinarySchema, BooleanSchema, DateSchema, Schema, ValidationError, ValidationOptions,
  ValidationResult, FunctionSchema, NumberSchema, SchemaMap, ObjectSchema, StringSchema, AlternativesSchema, Reference,
  ReferenceOptions, Extension, WhenOptions,
} from "joi";

export declare type Middleware = (ctx: Context, next: MiddlewareNext) => Promise<any>;
export declare type MiddlewareNext = () => Promise<any>;
export declare type WrappedHandler = (call: IServerCall, callback?: RpcImplCallback) => Promise<any>;
export declare class Application extends EventEmitter {
    private _middleware;
    private _context;
    private _server;

    constructor();

    /**
     * Get the gRPC Server.
     * @returns {Server}
     */
    readonly server: Server;

    /**
     * Bind the server with a port and a given credential.
     * @param {string} address format: "address:port"
     * @param {ServerCredentials} creds optional
     * @returns {Application}
     */
    bind(address: string, creds?: ServerCredentials): Application;

    /**
     * Start the Application server.
     */
    start(): void;

    /**
     * Use the given middleware.
     * @param {Middleware} middleware
     * @returns {Application}
     */
    use(middleware: Middleware): this;

    /**
     * Create context instance.
     * @param {IServerCall} call
     * @param {RpcImplCallback} callback optional
     * @returns {Context}
     * @private
     */
    private _createContext(call, callback?);

    /**
     * Default Application error handler.
     * @param {Error} err
     * @private
     */
    private _onError(err);

    /**
     * Wrap gRPC handler with other middleware.
     * @param {Middleware} reqHandler
     * @returns {WrappedHandler}
     */
    wrapGrpcHandler(reqHandler: Middleware): (call: IServerCall, callback?: RpcImplCallback) => Promise<any>;
}

export declare enum GrpcOpType {
    SEND_INITIAL_METADATA = 0,
    SEND_MESSAGE = 1,
    SEND_CLOSE_FROM_CLIENT = 2,
    SEND_STATUS_FROM_SERVER = 3,
    RECV_INITIAL_METADATA = 4,
    RECV_MESSAGE = 5,
    RECV_STATUS_ON_CLIENT = 6,
    RECV_CLOSE_ON_SERVER = 7,
}
export declare class Context {
    app: Application;
    call: IServerCall;
    callback: RpcImplCallback;

    constructor();

    /**
     * Handle error with gRPC status.
     * @see {@link https://github.com/grpc/grpc/blob/v1.3.7/src/node/src/server.js#L69-L101}
     * @param {Error} err
     */
    onError(err: Error): void;
}

/**
 * Validates a value using the given schema and options.
 */
export declare function joiValidate<T>(value: T): Promise<ValidationResult<T>>;
export declare function joiValidate<T, R>(value: T, callback: (err: ValidationError, value: T) => R): Promise<R>;

export declare function joiValidate<T>(value: T, schema: Schema): Promise<ValidationResult<T>>;
export declare function joiValidate<T>(value: T, schema: Object): Promise<ValidationResult<T>>;
export declare function joiValidate<T, R>(value: T, schema: Schema, callback: (err: ValidationError, value: T) => R): Promise<R>;
export declare function joiValidate<T, R>(value: T, schema: Object, callback: (err: ValidationError, value: T) => R): Promise<R>;

export declare function joiValidate<T>(value: T, schema: Schema, options: ValidationOptions): Promise<ValidationResult<T>>;
export declare function joiValidate<T>(value: T, schema: Object, options: ValidationOptions): Promise<ValidationResult<T>>;
export declare function joiValidate<T, R>(value: T, schema: Schema, options: ValidationOptions, callback: (err: ValidationError, value: T) => R): Promise<R>;
export declare function joiValidate<T, R>(value: T, schema: Object, options: ValidationOptions, callback: (err: ValidationError, value: T) => R): Promise<R>;

export declare const joi: {
  any(): Schema,
  array(): ArraySchema,
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