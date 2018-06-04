import * as LibPath from 'path';
import * as LibFs from 'mz/fs';
import * as recursive from 'recursive-readdir';
import {
  Field as ProtobufField, IParserResult as ProtobufIParserResult, Method as ProtobufMethod,
  Namespace as ProtobufNamespace, ReflectionObject as ProtobufReflectionObject, Service as ProtobufService,
  Type as ProtobufType, MapField as ProtobufMapField, FieldBase as ProtobufFieldBase
} from 'protobufjs';
import * as LibMkdirP from 'mkdirp';
import { Schema as SwaggerSchema, Spec as SwaggerSpec } from 'swagger-schema-official';
import * as LibUtil from 'util';

const wrappedProtobufjsParse = require('./protobufjs/ParseWrapper');
const mkdirp: (arg1: string) => Promise<string> = LibUtil.promisify<string, string>(LibMkdirP);

const PROTO_BUFFER_BASE_TYPE = [
  'double',
  'float',
  'int32',
  'int64',
  'uint32',
  'uint64',
  'sint32',
  'sint64',
  'fixed32',
  'fixed64',
  'sfixed32',
  'sfixed64',
  'bool',
  'string',
  'bytes'
];

/**
 * protoDir: /Users/XXX/Projects/projectX/result
 * outputDir: /output/dir/specified
 * file: /Users/XXX/Projects/projectX/result/dummy/your.result
 *     => dummy/your.result
 * protoFile.protoPath = /Users/XXX/Projects/projectX/result
 * protoFile.relativePath = dummy
 * protoFile.fileName = your.result
 * protoFile.filePath = dummy/your.result
 * protoFile.msgNamespace = your_pb
 * protoFile.svcNamespace = your_grpc_pb
 */
export interface ProtoFile {
  protoPath: string;
  outputPath: string;
  relativePath: string;
  fileName: string;
  filePath: string;
  msgNamespace: string;
  svcNamespace: string;
}

export interface ProtoParseResult {
  result: ProtobufIParserResult;
  protoFile: ProtoFile;
}

export interface ProtoMsgImportInfo {
  msgType: string;
  namespace: string;
  protoFile: ProtoFile;
  fields?: Array<FieldInfo>;
  methods?: Array<MethodInfo>;
}

export interface FieldInfo {
  fieldName: string;
  fieldType: string;
  fieldComment: object | string;
  isRepeated: boolean;
  keyType?: string;
  fieldInfo?: FieldInfo[] | string;
}

export interface GoogleHttpOption {
  method: string;
  router: string;
}

export interface MethodInfo {
  methodName: string;
  methodComment: object | string;
  requestType: string;
  requestStream: boolean;
  responseType: string;
  responseStream: boolean;
  googleHttpOption?: GoogleHttpOption;
}

export interface ProtoMsgImportInfos {
  [msgTypeStr: string]: ProtoMsgImportInfo;
}

export interface RpcProtoServicesInfo {
  protoFile: ProtoFile;
  protoServiceImportPath: string;
  protoMessageImportPath?: { [key: string]: Array<string> };
  services: {
    [serviceName: string]: Array<RpcMethodInfo>;
  };
}

export interface RpcProtoClientInfo {
  packageName: string;
  protoName: string;
  ucProtoName: string;
  className: string;
  clientName: string;
  protoFile: ProtoFile;
  protoImportPath: string;
  methodList: Array<RpcMethodInfo>;
  allMethodImportPath: string;
  allMethodImportModule: Array<string>;
  useZipkin: boolean;
}

export interface RpcMethodInfo {
  callTypeStr: string;
  callGenerics: string;
  requestTypeStr: string;
  responseTypeStr: string;
  hasCallback: boolean;
  hasRequest: boolean;
  methodName: string;
  protoMsgImportPath: RpcMethodImportPathInfos;
}

export interface JoiComment {
  required: boolean;
  defaultValue?: any;
  valid?: Array<any>;
  invalid?: Array<any>;
  min?: number;
  max?: number;
  greater?: number;
  less?: number;
  interger?: any;
  positive?: any;
  regex?: string;
  truthy?: Array<any>;
  falsy?: Array<any>;
  allow?: Array<any>;
  email?: boolean;
  uri?: Array<any>;
  timestamp?: 'unix' | 'javascript';
}

/**
 * Used: Command rpcs, generating services stubs.
 * When handling proto to generate services files, it's necessary to know
 * the imported messages in third party codes.
 *
 * e.g
 * {
 *   // imported third party code files: [ imported third party messages ]
 *   '../../proto/user_pb': [ 'User', 'GetUserRequest' ]
 * }
 */
export interface RpcMethodImportPathInfos {
  [importPath: string]: Array<string>;
}

/**
 * 将 swagger.json 的 definitions 下的内容解析成 Array<GatewaySwaggerSchema>
 *
 * e.g
 * demo.swagger.json
 * {
 *  ...
 *  "definitions": {
 *    "demoDemo": {
 *      "type": "object",
 *      "properties": {
 *          "id": {
 *              "type": "string",
 *              "format": "int64"
 *           },
 *           "tags": {
 *              "type": "array",
 *              "items": {
 *                  "type": "string"
 *              }
 *           },
 *           "demoOrders": {
 *              "type": "object",
 *              "additionalProperties": {
 *                  "$ref": "#/definitions/orderOrder"
 *              }
 *           }
 *      },
 *      },
 *  },
 *  ...
 * }
 * gatewaySwaggerSchema.name = "demoDemo"
 * gatewaySwaggerSchema.type = "object"
 * gatewaySwaggerSchema.required = false
 * gatewaySwaggerSchema.schema = [
 *      GatewaySwaggerSchema(
 *          name: "id",
 *          type: "string",
 *      ),
 *      GatewaySwaggerSchema(
 *          name: "tags",
 *          type: "array",
 *          protoArray: {
 *              "type": "string"
 *          }
 *      ),
 *      GatewaySwaggerSchema(
 *          name: "demoOrders",
 *          type: "object",
 *          protoMap: {
 *              "$ref": "#/definitions/orderOrder"
 *          }
 *      ),
 * ]
 */
export interface GatewaySwaggerSchema {
  name: string;
  type: string;           // string, number, array, object
  required: boolean;      // required, optional
  $ref?: string;
  schema?: Array<GatewaySwaggerSchema>;
  protoArray?: GatewaySwaggerCustomizedSchema;  // Proto: "repeated string tags" => Swagger: definitions.demoDemo.properties.tags.items
  protoMap?: GatewaySwaggerCustomizedSchema;    // Proto: "map<string, order.Order> demoOrders" => Swagger: definitions.demoDemo.properties.demoOrders.additionalProperties
}

export interface GatewaySwaggerCustomizedSchema extends SwaggerSchema {
  schema?: Array<GatewaySwaggerSchema>;
}

/**
 * 定义一个 swagger.json 中的 definitions 的结构。
 */
export interface SwaggerDefinitionMap {
  [definitionsName: string]: SwaggerSchema;
}

/**
 * 读取 protoDir 文件夹内的 proto 文件名生成 ProtoFile 结构体。
 *
 * @param {string} protoDir
 * @param {string} outputDir
 * @param {Array<string>} excludes
 * @returns {Promise<Array<ProtoFile>>}
 */
export const readProtoList = async function (protoDir: string, outputDir: string, excludes?: Array<string>): Promise<Array<ProtoFile>> {
  let files = await recursive(protoDir, ['.DS_Store', function ignoreFunc(file, stats) {
    let shallIgnore = false;
    if (!excludes || excludes.length === 0) {
      return shallIgnore;
    }
    excludes.forEach((exclude: string) => {
      if (file.indexOf(LibPath.normalize(exclude)) !== -1) {
        shallIgnore = true;
      }
    });
    return shallIgnore;
  }]);

  let protoFiles = files.map((file: string) => {
    let protoFile = {} as ProtoFile;

    file = file.replace(protoDir, ''); // remove base dir
    if (file.substr(0, 1) === '/') { // remove first '/'
      file = file.substr(1);
    }
    protoFile.protoPath = protoDir;
    protoFile.outputPath = outputDir;
    protoFile.relativePath = LibPath.dirname(file);
    protoFile.fileName = LibPath.basename(file);
    protoFile.filePath = file;
    protoFile.msgNamespace = Proto.filePathToPseudoNamespace(protoFile.fileName);
    protoFile.svcNamespace = Proto.filePathToServiceNamespace(protoFile.fileName);

    if (protoFile.fileName.match(/.+\.proto/) !== null) {
      return protoFile;
    } else {
      return undefined;
    }
  }).filter((value: undefined | ProtoFile) => {
    return value !== undefined;
  });

  return Promise.resolve(protoFiles);
};

/**
 * 读取 *.proto 文件生成 ProtobufIParserResult 结构体
 *
 * @param {ProtoFile} protoFile
 * @returns {Promise<IParserResult>}
 */
export const parseProto = async function (protoFile: ProtoFile): Promise<ProtobufIParserResult> {
  let content = await LibFs.readFile(Proto.genFullProtoFilePath(protoFile));
  let proto = wrappedProtobufjsParse(content.toString());

  return Promise.resolve(proto);
};

/**
 * 从 ProtobufIParserResult 结构体中解析 Service 数据
 *
 * @param {IParserResult} proto
 * @returns {Array<Service>}
 */
export const parseServicesFromProto = function (proto: ProtobufIParserResult): Array<ProtobufService> {
  let pkgRoot = proto.root.lookup(proto.package) as ProtobufNamespace;
  let services = [] as Array<ProtobufService>;
  let nestedKeys = Object.keys(pkgRoot.nested);
  nestedKeys.forEach((nestedKey) => {
    let nestedInstance = pkgRoot.nested[nestedKey];
    if (!(nestedInstance instanceof ProtobufService)) {
      return;
    }
    services.push(nestedInstance as ProtobufService);
  });

  return services;
};

/**
 * 从 ProtobufIParserResult 结构体中解析 import 的 package 相关数据
 *
 * @param {IParserResult} proto
 * @param {ProtoFile} protoFile
 * @param {string} symlink
 * @returns {ProtoMsgImportInfos}
 */
export const parseMsgNamesFromProto = function (proto: ProtobufIParserResult, protoFile: ProtoFile, symlink: string = '.'): ProtoMsgImportInfos {
  let pkgRoot = proto.root.lookup(proto.package) as ProtobufNamespace;
  let msgImportInfos = {} as ProtoMsgImportInfos;
  let nestedKeys = Object.keys(pkgRoot.nested);
  const packageName = proto.package;
  nestedKeys.forEach((nestedKey) => {
    // packageName: 'user' + symlink: '.' + nestedKey: 'UserService' = 'user.UserService'
    let msgTypeStr = pkgRoot.name + symlink + nestedKey;
    const reflectObj: ProtobufReflectionObject = pkgRoot.lookup(nestedKey);
    const fields: FieldInfo[] = [];
    const methods: MethodInfo[] = [];
    if (reflectObj.hasOwnProperty('fields')) {
      // Means this ReflectionObject is typeof Type
      const protoType = reflectObj as ProtobufType;
      Object.keys(protoType.fields).forEach((fieldKey) => {
        const fieldBase = protoType.fields[fieldKey] as ProtobufFieldBase;
        let keyType;
        if (fieldBase.hasOwnProperty('keyType')) {
          const mapField = fieldBase as ProtobufMapField;
          keyType = mapField.keyType;
        }
        let fieldType = fieldBase.type;
        let childInfo;
        if (PROTO_BUFFER_BASE_TYPE.indexOf(fieldType) < 0) {
          /**
           * Means this field is a custom type
           * If type contain '.' means this type is import from other proto file
           * Need change type from {package}.{MessageName} to {package}{MessageName} : order.Order => orderOrder
           */
          fieldType = fieldType.indexOf('.') >= 0 ? fieldType.replace('.', symlink) : packageName + symlink + fieldType;
          childInfo = fieldType;
        }

        let commentObject;
        try {
          commentObject = JSON.parse(fieldBase.comment);
        } catch (e) {
          console.error(`JSON parse error at [${protoType.name}.${fieldBase.name}]`);
        }

        const fieldInfo: FieldInfo = {
          fieldType: fieldType,
          fieldName: fieldBase.name,
          fieldComment: commentObject || fieldBase.comment,
          isRepeated: fieldBase.repeated,
          fieldInfo: childInfo,
          keyType
        };

        fields.push(fieldInfo);
      });
    } else if (reflectObj.hasOwnProperty('methods')) {
      // Means this ReflectionObject is typeof Service
      const protoService = reflectObj as ProtobufService;
      Object.keys(protoService.methods).forEach((methodKey) => {
        const method = protoService.methods[methodKey] as ProtobufMethod;
        const requestAndResponse: string[] = [method.requestType, method.responseType].map((value) => {
          return value.indexOf('.') >= 0 ? value.replace('.', symlink) : packageName + symlink + value;
        });

        let googleHttpOption: GoogleHttpOption;
        if (method.options && Object.keys(method.options).length > 0) {
          Object.keys(method.options).forEach((option) => {
            const opt = option.replace('(google.api.http).', '');
            if (['get', 'head', 'post', 'options', 'put', 'delete', 'trace', 'connect'].indexOf(opt) >= 0) {
              googleHttpOption = {
                method: opt.toUpperCase(),
                router: method.options[option]
              };
            }
          });
        }

        let commentObject;
        if (method.comment) {
          try {
            commentObject = JSON.parse(method.comment);
          } catch (e) {
            console.error(`JSON parse failed at [${protoService.name}.${method.name}]`);
            commentObject = method.comment;
          }
        }

        const methodInfo: MethodInfo = {
          methodName: method.name,
          methodComment: commentObject,
          requestType: requestAndResponse[0],
          requestStream: method.requestStream,
          responseType: requestAndResponse[1],
          responseStream: method.responseStream,
          googleHttpOption: googleHttpOption,
        };

        methods.push(methodInfo);
      });
    }
    msgImportInfos[msgTypeStr] = {
      msgType: nestedKey,
      namespace: pkgRoot.name,
      protoFile: protoFile,
      fields: fields,
      methods: methods,
    } as ProtoMsgImportInfo;
  });

  return msgImportInfos;
};

/**
 * When handling proto to generate services files, it's necessary to know
 * the imported messages in third party codes.
 *
 * @param {ProtoFile} protoFile
 * @param {Method} method
 * @param {string} outputPath
 * @param {ProtoMsgImportInfos} protoMsgImportInfos
 * @param {string} dirName
 * @returns {RpcMethodInfo}
 */
export const genRpcMethodInfo = function (protoFile: ProtoFile, method: ProtobufMethod, outputPath: string, protoMsgImportInfos: ProtoMsgImportInfos, dirName: string = 'services'): RpcMethodInfo {
  let defaultImportPath = Proto.genProtoMsgImportPath(protoFile, outputPath, dirName);
  let protoMsgImportPaths = {} as RpcMethodImportPathInfos;

  let requestType = method.requestType;
  let requestTypeImportPath = defaultImportPath;
  if (protoMsgImportInfos.hasOwnProperty(method.requestType)) {
    requestType = protoMsgImportInfos[method.requestType].msgType;
    requestTypeImportPath = Proto.genProtoMsgImportPath(protoMsgImportInfos[method.requestType].protoFile, outputPath, dirName);
  }
  protoMsgImportPaths = addIntoRpcMethodImportPathInfos(protoMsgImportPaths, requestType, requestTypeImportPath);

  let responseType = method.responseType;
  let responseTypeImportPath = defaultImportPath;
  if (protoMsgImportInfos.hasOwnProperty(method.responseType)) {
    responseType = protoMsgImportInfos[method.responseType].msgType;
    responseTypeImportPath = Proto.genProtoMsgImportPath(protoMsgImportInfos[method.responseType].protoFile, outputPath, dirName);
  }
  protoMsgImportPaths = addIntoRpcMethodImportPathInfos(protoMsgImportPaths, responseType, responseTypeImportPath);

  return {
    callTypeStr: '',
    requestTypeStr: requestType,
    responseTypeStr: responseType,
    hasCallback: false,
    hasRequest: false,
    methodName: lcfirst(method.name),
    protoMsgImportPath: protoMsgImportPaths
  } as RpcMethodInfo;
};

export const addIntoRpcMethodImportPathInfos = function (protoMsgImportPaths: RpcMethodImportPathInfos, type: string, importPath: string): RpcMethodImportPathInfos {
  if (!protoMsgImportPaths.hasOwnProperty(importPath)) {
    protoMsgImportPaths[importPath] = [];
  }

  protoMsgImportPaths[importPath].push(type);

  return protoMsgImportPaths;
};

export const mkdir = async function (path: string): Promise<string> {
  return mkdirp(path) as any; // Bulebird<string> => Promise<string>
};

export const lcfirst = function (str): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
};

export const ucfirst = function (str): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export namespace Proto {

  /**
   * dummy/your.proto => ../
   * dummy/and/dummy/your.proto => ../../../
   * @param {string} filePath
   * @returns {string}
   */
  export function getPathToRoot(filePath: string) {
    const depth = filePath.replace(/\\/g, '/').split('/').length;
    return depth === 1 ? './' : new Array(depth).join('../');
  }

  /**
   * dummy/your.proto => dummy_your_pb
   * @param {string} filePath
   * @returns {string}
   */
  export const filePathToPseudoNamespace = function (filePath: string): string {
    return filePath.replace('.proto', '').replace(/\//g, '_').replace(/\./g, '_').replace(/-/g, '_') + '_pb';
  };

  /**
   * dummy/your.proto => dummy_your_grpc_pb
   * @param {string} filePath
   * @returns {string}
   */
  export function filePathToServiceNamespace(filePath: string): string {
    return filePath.replace('.proto', '').replace(/\//g, '_').replace(/\./g, '_').replace(/-/g, '_') + '_grpc_pb';
  }

  /**
   * Generate service proto js file (e.g *_grpc_pb.js) import path.
   * Source code is "register.ts", service proto js import path is relative to it.
   * @param {ProtoFile} protoFile
   * @returns {string}
   */
  export const genProtoServiceImportPath = function (protoFile: ProtoFile): string {
    return LibPath.join(
      '..',
      'proto',
      protoFile.relativePath,
      protoFile.svcNamespace
    );
  };

  /**
   * Generate client proto js file (e.g *_grpc_pb.js) import path.
   * @param {ProtoFile} protoFile
   * @returns {string}
   */
  export const genProtoClientImportPath = function (protoFile: ProtoFile): string {
    return LibPath.join(
      '..',
      '..',
      'proto',
      protoFile.relativePath,
      protoFile.svcNamespace
    );
  };

  /**
   * Generate origin protobuf definition (e.g *.proto) full file path.
   * @param {ProtoFile} protoFile
   * @returns {string}
   */
  export const genFullProtoFilePath = function (protoFile: ProtoFile): string {
    return LibPath.join(protoFile.protoPath, protoFile.relativePath, protoFile.fileName);
  };

  /**
   * Generate message proto js file (e.g *_pb.js) import path.
   * Source code path is generated with {@link genFullOutputServicePath},
   * message proto js import path is relative to it.
   * @param {ProtoFile} protoFile
   * @param {string} filePath
   * @param {string} dirname
   * @returns {string}
   */
  export const genProtoMsgImportPath = function (protoFile: ProtoFile, filePath: string, dirName: string = 'services'): string {
    return LibPath.join(
      getPathToRoot(filePath.substr(filePath.indexOf(dirName))),
      'proto',
      protoFile.relativePath,
      protoFile.msgNamespace
    );
  };

  /**
   * Generate message result js file (e.g *_pb.js) import path.
   * Source code path is generated with {@link genFullOutputServicePath},
   * message result js import path is relative to it.
   * @param {ProtoFile} protoFile
   * @param {string} routerDirPath
   * @returns {string}
   */
  export const genProtoMsgImportPathViaRouterPath = function (protoFile: ProtoFile, routerDirPath: string): string {
    return LibPath.join(
      getPathToRoot(routerDirPath.substr(routerDirPath.indexOf('router'))),
      'proto',
      protoFile.relativePath,
      protoFile.msgNamespace
    );
  };

  /**
   * Generate full service stub code output path.
   * @param {ProtoFile} protoFile
   * @param {Service} service
   * @param {Method} method
   * @returns {string}
   */
  export const genFullOutputServicePath = function (protoFile: ProtoFile, service: ProtobufService, method: ProtobufMethod) {
    return LibPath.join(
      protoFile.outputPath,
      'services',
      protoFile.relativePath,
      protoFile.svcNamespace,
      service.name,
      lcfirst(method.name) + '.ts'
    );
  };

  /**
   * Generate full client stub code output path.
   * @param {ProtoFile} protoFile
   * @returns {string}
   */
  export const genFullOutputClientPath = function (protoFile: ProtoFile) {
    return LibPath.join(
      protoFile.outputPath,
      'clients',
      protoFile.relativePath,
      `MS${ucfirst(LibPath.basename(protoFile.fileName, '.proto'))}Client.ts`
    );
  };

  /**
   * Generate full service stub code output dir.
   * @param {ProtoFile} protoFile
   * @param {string} packageName
   * @param {string} serviceName
   * @param {string} apiName
   * @returns {string}
   */
  export const genFullOutputRouterApiPath = function (protoFile: ProtoFile, packageName: string = 'default', serviceName: string = 'default', apiName: string = 'default') {
    return LibPath.join(
      protoFile.outputPath,
      'router',
      packageName,
      serviceName,
      apiName
    );
  };
}

/**
 * Read Swagger spec schema from swagger dir
 *
 * @param {string} swaggerDir
 * @param {string} outputDir
 * @param {Array<string>} excludes, optional param
 * @returns {Promise<Array<SwaggerSpec>>}
 */
export const readSwaggerList = async function (swaggerDir: string, outputDir: string, excludes?: Array<string>): Promise<Array<SwaggerSpec>> {
  let files = await recursive(swaggerDir, ['.DS_Store', function (file) {
    let shallIgnore = false;
    if (!excludes || excludes.length === 0) {
      return shallIgnore;
    }
    excludes.forEach((exclude: string) => {
      if (file.indexOf(LibPath.normalize(exclude)) !== -1) {
        shallIgnore = true;
      }
    });
    return shallIgnore;
  }]);

  let swaggerList = files.map((file: string) => {
    file = file.replace(swaggerDir, ''); // remove base dir
    if (LibPath.basename(file).match(/.+\.json/) !== null) {
      let filePath = LibPath.join(swaggerDir, LibPath.dirname(file), LibPath.basename(file));
      try {
        return JSON.parse(LibFs.readFileSync(filePath).toString());
      } catch (e) {
        console.log(`Error: ${e.message}`);
        return undefined;
      }
    } else {
      return undefined;
    }
  }).filter((value: undefined | SwaggerSpec) => {
    return value !== undefined;
  });

  return Promise.resolve(swaggerList);
};

export namespace Swagger {

  /**
   * #/definitions/bookBookModel => bookBookModel
   *
   * @param {string} ref
   * @returns {string}
   */
  export function getRefName(ref: string): string {
    return ref.replace('#/definitions/', '');
  }

  /**
   * Convert SwaggerType To JoiType
   * <pre>
   *   integer => number
   * </pre>
   *
   * @param {string} type
   * @returns {string}
   */
  export function convertSwaggerTypeToJoiType(type: string): string {
    type = type.toLowerCase();
    switch (type) {
      case 'string':
      case 'boolean':
      case 'object':
      case 'array':
      case 'number':
        return type;
      case 'integer':
        return 'number';
      default:
        return 'any';
    }
  }

  /**
   * Convert Swagger Uri to Koa Uri
   * <pre>
   *   /v1/book/{isbn}/{version} => /v1/book/:isbn/:version
   * </pre>
   *
   * @param {string} uri
   * @returns {string}
   */
  export function convertSwaggerUriToKoaUri(uri: string): string {
    let pathParams = uri.match(/{(.*?)}/igm);
    if (pathParams != null) {
      for (let pathParam of pathParams) {
        uri = uri.replace(pathParam, pathParam.replace('{', ':').replace('}', ''));
      }
    }
    return uri;
  }

  /**
   * Parse swagger definitions schema to Array<GatewaySwaggerSchema>
   *
   * @param {SwaggerDefinitionMap} definitionMap
   * @param {string} definitionName
   * @param {number} level, Current loop definitionMap level
   * @param {number} maxLevel, Max loop definitionMap level count
   * @returns {Array<GatewaySwaggerSchema>}
   */
  export function parseSwaggerDefinitionMap(definitionMap: SwaggerDefinitionMap, definitionName: string, level: number = 1, maxLevel: number = 5): Array<GatewaySwaggerSchema> {
    // definitionName not found, return []
    if (!definitionMap.hasOwnProperty(definitionName)) {
      return [];
    }
    let canDeepSearch = (maxLevel <= 0) ? true : (level++ <= maxLevel);

    let swaggerSchemaList = [] as Array<GatewaySwaggerSchema>;
    let definition = definitionMap[definitionName] as SwaggerSchema;

    // key: string => value: SwaggerSchema
    for (let propertyName in definition.properties) {
      let definitionSchema = definition.properties[propertyName] as SwaggerSchema;

      let type: string;
      let schema: Array<GatewaySwaggerSchema> = [];

      if (definitionSchema.$ref) {
        type = 'object';
        if (canDeepSearch) {
          schema = parseSwaggerDefinitionMap(definitionMap, Swagger.getRefName(definitionSchema.$ref), level, maxLevel);
        }
      } else if (definitionSchema.type) {
        type = Swagger.convertSwaggerTypeToJoiType(definitionSchema.type);
        if (definitionSchema.type === 'array' && definitionSchema.items.hasOwnProperty('$ref')) {
          // is repeated field
          if (canDeepSearch) {
            schema = parseSwaggerDefinitionMap(definitionMap, Swagger.getRefName((definitionSchema.items as SwaggerSchema).$ref), level, maxLevel);
          }
        } else if (definitionSchema.type === 'object' && definitionSchema.additionalProperties && definitionSchema.additionalProperties.hasOwnProperty('$ref')) {
          // is map field field
          if (canDeepSearch) {
            schema = parseSwaggerDefinitionMap(definitionMap, Swagger.getRefName(definitionSchema.additionalProperties.$ref), level, maxLevel);
          }
        } else if (definitionSchema.type === 'string' && definitionSchema.format == 'int64') {
          type = 'number';
        }
      } else {
        type = 'any';
      }

      let swaggerSchema: GatewaySwaggerSchema = {
        name: propertyName,
        required: (!definition.required == undefined && definition.required.length > 0 && definition.required.indexOf(propertyName) >= 0),
        type: type,
      };

      if (definitionSchema.$ref) {
        swaggerSchema.$ref = definitionSchema.$ref;

        if (schema.length > 0) {
          swaggerSchema.schema = schema;
        }
      } else if (definitionSchema.additionalProperties) {
        swaggerSchema.protoMap = definitionSchema.additionalProperties;

        if (schema.length > 0) {
          swaggerSchema.protoMap.schema = schema;
        }
      } else if (definitionSchema.items) {
        swaggerSchema.protoArray = definitionSchema.items as GatewaySwaggerCustomizedSchema;

        if (schema.length > 0) {
          swaggerSchema.protoArray.schema = schema;
        }
      }

      swaggerSchemaList.push(swaggerSchema);
    }

    return swaggerSchemaList;
  }

}
