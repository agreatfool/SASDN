"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const LibPath = require("path");
const LibFs = require("mz/fs");
const recursive = require("recursive-readdir");
const protobuf = require("protobufjs");
const protobufjs_1 = require("protobufjs");
const bluebird = require("bluebird");
const LibMkdirP = require("mkdirp");
const mkdirp = bluebird.promisify(LibMkdirP);
/**
 * 读取 protoDir 文件夹内的 proto 文件名生成 ProtoFile 结构体。
 *
 * @param {string} protoDir
 * @param {string} outputDir
 * @param {Array<string>} excludes
 * @returns {Promise<Array<ProtoFile>>}
 */
exports.readProtoList = function (protoDir, outputDir, excludes) {
    return __awaiter(this, void 0, void 0, function* () {
        let files = yield recursive(protoDir, ['.DS_Store', function ignoreFunc(file, stats) {
                let shallIgnore = false;
                if (!excludes || excludes.length === 0) {
                    return shallIgnore;
                }
                excludes.forEach((exclude) => {
                    if (file.indexOf(LibPath.normalize(exclude)) !== -1) {
                        shallIgnore = true;
                    }
                });
                return shallIgnore;
            }]);
        let protoFiles = files.map((file) => {
            let protoFile = {};
            file = file.replace(protoDir, ''); // remove base dir
            if (file.substr(0, 1) === '/') {
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
            }
            else {
                return undefined;
            }
        }).filter((value) => {
            return value !== undefined;
        });
        return Promise.resolve(protoFiles);
    });
};
/**
 * 读取 *.proto 文件生成 ProtobufIParserResult 结构体
 *
 * @param {ProtoFile} protoFile
 * @returns {Promise<IParserResult>}
 */
exports.parseProto = function (protoFile) {
    return __awaiter(this, void 0, void 0, function* () {
        let content = yield LibFs.readFile(Proto.genFullProtoFilePath(protoFile));
        let proto = protobuf.parse(content.toString());
        return Promise.resolve(proto);
    });
};
/**
 * 从 ProtobufIParserResult 结构体中解析 Service 数据
 *
 * @param {IParserResult} proto
 * @returns {Array<Service>}
 */
exports.parseServicesFromProto = function (proto) {
    let pkgRoot = proto.root.lookup(proto.package);
    let services = [];
    let nestedKeys = Object.keys(pkgRoot.nested);
    nestedKeys.forEach((nestedKey) => {
        let nestedInstance = pkgRoot.nested[nestedKey];
        if (!(nestedInstance instanceof protobufjs_1.Service)) {
            return;
        }
        services.push(nestedInstance);
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
exports.parseMsgNamesFromProto = function (proto, protoFile, symlink = '.') {
    let pkgRoot = proto.root.lookup(proto.package);
    let msgImportInfos = {};
    let nestedKeys = Object.keys(pkgRoot.nested);
    nestedKeys.forEach((nestedKey) => {
        // packageName: 'user' + symlink: '.' + nestedKey: 'UserService' = 'user.UserService'
        let msgTypeStr = pkgRoot.name + symlink + nestedKey;
        msgImportInfos[msgTypeStr] = {
            msgType: nestedKey,
            namespace: pkgRoot.name,
            protoFile: protoFile
        };
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
 * @returns {RpcMethodInfo}
 */
exports.genRpcMethodInfo = function (protoFile, method, outputPath, protoMsgImportInfos) {
    let defaultImportPath = Proto.genProtoMsgImportPath(protoFile, outputPath);
    let protoMsgImportPaths = {};
    let requestType = method.requestType;
    let requestTypeImportPath = defaultImportPath;
    if (protoMsgImportInfos.hasOwnProperty(method.requestType)) {
        requestType = protoMsgImportInfos[method.requestType].msgType;
        requestTypeImportPath = Proto.genProtoMsgImportPath(protoMsgImportInfos[method.requestType].protoFile, outputPath);
    }
    protoMsgImportPaths = exports.addIntoRpcMethodImportPathInfos(protoMsgImportPaths, requestType, requestTypeImportPath);
    let responseType = method.responseType;
    let responseTypeImportPath = defaultImportPath;
    if (protoMsgImportInfos.hasOwnProperty(method.responseType)) {
        responseType = protoMsgImportInfos[method.responseType].msgType;
        responseTypeImportPath = Proto.genProtoMsgImportPath(protoMsgImportInfos[method.responseType].protoFile, outputPath);
    }
    protoMsgImportPaths = exports.addIntoRpcMethodImportPathInfos(protoMsgImportPaths, responseType, responseTypeImportPath);
    return {
        callTypeStr: '',
        requestTypeStr: requestType,
        responseTypeStr: responseType,
        hasCallback: false,
        hasRequest: false,
        methodName: exports.lcfirst(method.name),
        protoMsgImportPath: protoMsgImportPaths
    };
};
exports.addIntoRpcMethodImportPathInfos = function (protoMsgImportPaths, type, importPath) {
    if (!protoMsgImportPaths.hasOwnProperty(importPath)) {
        protoMsgImportPaths[importPath] = [];
    }
    protoMsgImportPaths[importPath].push(type);
    return protoMsgImportPaths;
};
exports.mkdir = function (path) {
    return __awaiter(this, void 0, void 0, function* () {
        return mkdirp(path); // Bulebird<string> => Promise<string>
    });
};
exports.lcfirst = function (str) {
    return str.charAt(0).toLowerCase() + str.slice(1);
};
exports.ucfirst = function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
var Proto;
(function (Proto) {
    /**
     * dummy/your.proto => ../
     * dummy/and/dummy/your.proto => ../../../
     * @param {string} filePath
     * @returns {string}
     */
    function getPathToRoot(filePath) {
        const depth = filePath.replace(/\\/g, '/').split('/').length;
        return depth === 1 ? './' : new Array(depth).join('../');
    }
    Proto.getPathToRoot = getPathToRoot;
    /**
     * dummy/your.proto => dummy_your_pb
     * @param {string} filePath
     * @returns {string}
     */
    Proto.filePathToPseudoNamespace = function (filePath) {
        return filePath.replace('.proto', '').replace(/\//g, '_').replace(/\./g, '_').replace(/-/g, '_') + '_pb';
    };
    /**
     * dummy/your.proto => dummy_your_grpc_pb
     * @param {string} filePath
     * @returns {string}
     */
    function filePathToServiceNamespace(filePath) {
        return filePath.replace('.proto', '').replace(/\//g, '_').replace(/\./g, '_').replace(/-/g, '_') + '_grpc_pb';
    }
    Proto.filePathToServiceNamespace = filePathToServiceNamespace;
    /**
     * Generate service proto js file (e.g *_grpc_pb.js) import path.
     * Source code is "register.ts", service proto js import path is relative to it.
     * @param {ProtoFile} protoFile
     * @returns {string}
     */
    Proto.genProtoServiceImportPath = function (protoFile) {
        return LibPath.join('..', 'proto', protoFile.relativePath, protoFile.svcNamespace);
    };
    /**
     * Generate origin protobuf definition (e.g *.proto) full file path.
     * @param {ProtoFile} protoFile
     * @returns {string}
     */
    Proto.genFullProtoFilePath = function (protoFile) {
        return LibPath.join(protoFile.protoPath, protoFile.relativePath, protoFile.fileName);
    };
    /**
     * Generate message proto js file (e.g *_pb.js) import path.
     * Source code path is generated with {@link genFullOutputServicePath},
     * message proto js import path is relative to it.
     * @param {ProtoFile} protoFile
     * @param {string} serviceFilePath
     * @returns {string}
     */
    Proto.genProtoMsgImportPath = function (protoFile, serviceFilePath) {
        return LibPath.join(getPathToRoot(serviceFilePath.substr(serviceFilePath.indexOf('services'))), 'proto', protoFile.relativePath, protoFile.msgNamespace);
    };
    /**
     * Generate message result js file (e.g *_pb.js) import path.
     * Source code path is generated with {@link genFullOutputServicePath},
     * message result js import path is relative to it.
     * @param {ProtoFile} protoFile
     * @param {string} routerDirPath
     * @returns {string}
     */
    Proto.genProtoMsgImportPathViaRouterPath = function (protoFile, routerDirPath) {
        return LibPath.join(getPathToRoot(routerDirPath.substr(routerDirPath.indexOf('router'))), 'proto', protoFile.relativePath, protoFile.msgNamespace);
    };
    /**
     * Generate full service stub code output path.
     * @param {ProtoFile} protoFile
     * @param {Service} service
     * @param {Method} method
     * @returns {string}
     */
    Proto.genFullOutputServicePath = function (protoFile, service, method) {
        return LibPath.join(protoFile.outputPath, 'services', protoFile.relativePath, protoFile.svcNamespace, service.name, exports.lcfirst(method.name) + '.ts');
    };
    /**
     * Generate full service stub code output dir.
     * @param {ProtoFile} protoFile
     * @param {string} packageName
     * @param {string} serviceName
     * @param {string} apiName
     * @returns {string}
     */
    Proto.genFullOutputRouterApiPath = function (protoFile, packageName = 'default', serviceName = 'default', apiName = 'default') {
        return LibPath.join(protoFile.outputPath, 'router', packageName, serviceName, apiName);
    };
})(Proto = exports.Proto || (exports.Proto = {}));
/**
 * Read Swagger spec schema from swagger dir
 *
 * @param {string} swaggerDir
 * @param {string} outputDir
 * @param {Array<string>} excludes, optional param
 * @returns {Promise<Array<SwaggerSpec>>}
 */
exports.readSwaggerList = function (swaggerDir, outputDir, excludes) {
    return __awaiter(this, void 0, void 0, function* () {
        let files = yield recursive(swaggerDir, ['.DS_Store', function (file) {
                let shallIgnore = false;
                if (!excludes || excludes.length === 0) {
                    return shallIgnore;
                }
                excludes.forEach((exclude) => {
                    if (file.indexOf(LibPath.normalize(exclude)) !== -1) {
                        shallIgnore = true;
                    }
                });
                return shallIgnore;
            }]);
        let swaggerList = files.map((file) => {
            file = file.replace(swaggerDir, ''); // remove base dir
            if (LibPath.basename(file).match(/.+\.json/) !== null) {
                let filePath = LibPath.join(swaggerDir, LibPath.dirname(file), LibPath.basename(file));
                try {
                    return JSON.parse(LibFs.readFileSync(filePath).toString());
                }
                catch (e) {
                    console.log(`Error: ${e.message}`);
                    return undefined;
                }
            }
            else {
                return undefined;
            }
        }).filter((value) => {
            return value !== undefined;
        });
        return Promise.resolve(swaggerList);
    });
};
var Swagger;
(function (Swagger) {
    /**
     * #/definitions/bookBookModel => bookBookModel
     *
     * @param {string} ref
     * @returns {string}
     */
    function getRefName(ref) {
        return ref.replace('#/definitions/', '');
    }
    Swagger.getRefName = getRefName;
    /**
     * Convert SwaggerType To JoiType
     * <pre>
     *   integer => number
     * </pre>
     *
     * @param {string} type
     * @returns {string}
     */
    function convertSwaggerTypeToJoiType(type) {
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
    Swagger.convertSwaggerTypeToJoiType = convertSwaggerTypeToJoiType;
    /**
     * Convert Swagger Uri to Koa Uri
     * <pre>
     *   /v1/book/{isbn}/{version} => /v1/book/:isbn/:version
     * </pre>
     *
     * @param {string} uri
     * @returns {string}
     */
    function convertSwaggerUriToKoaUri(uri) {
        let pathParams = uri.match(/{(.*?)}/igm);
        if (pathParams != null) {
            for (let pathParam of pathParams) {
                uri = uri.replace(pathParam, pathParam.replace('{', ':').replace('}', ''));
            }
        }
        return uri;
    }
    Swagger.convertSwaggerUriToKoaUri = convertSwaggerUriToKoaUri;
    /**
     * Parse swagger definitions schema to Array<GatewaySwaggerSchema>
     *
     * @param {SwaggerDefinitionMap} definitionMap
     * @param {string} definitionName
     * @param {number} level, Current loop definitionMap level
     * @param {number} maxLevel, Max loop definitionMap level count
     * @returns {Array<GatewaySwaggerSchema>}
     */
    function parseSwaggerDefinitionMap(definitionMap, definitionName, level = 1, maxLevel = 5) {
        // definitionName not found, return []
        if (!definitionMap.hasOwnProperty(definitionName)) {
            return [];
        }
        let canDeepSearch = (maxLevel <= 0) ? true : (level++ <= maxLevel);
        let swaggerSchemaList = [];
        let definition = definitionMap[definitionName];
        // key: string => value: SwaggerSchema
        for (let propertyName in definition.properties) {
            let definitionSchema = definition.properties[propertyName];
            let type;
            let schema = [];
            if (definitionSchema.$ref) {
                type = 'object';
                if (canDeepSearch) {
                    schema = parseSwaggerDefinitionMap(definitionMap, Swagger.getRefName(definitionSchema.$ref), level, maxLevel);
                }
            }
            else if (definitionSchema.type) {
                type = Swagger.convertSwaggerTypeToJoiType(definitionSchema.type);
                if (definitionSchema.type === 'array' && definitionSchema.items.hasOwnProperty('$ref')) {
                    // is repeated field
                    if (canDeepSearch) {
                        schema = parseSwaggerDefinitionMap(definitionMap, Swagger.getRefName(definitionSchema.items.$ref), level, maxLevel);
                    }
                }
                else if (definitionSchema.type === 'object' && definitionSchema.additionalProperties && definitionSchema.additionalProperties.hasOwnProperty('$ref')) {
                    // is map field field
                    if (canDeepSearch) {
                        schema = parseSwaggerDefinitionMap(definitionMap, Swagger.getRefName(definitionSchema.additionalProperties.$ref), level, maxLevel);
                    }
                }
                else if (definitionSchema.type === 'string' && definitionSchema.format == 'int64') {
                    type = 'number';
                }
            }
            else {
                type = 'any';
            }
            let swaggerSchema = {
                name: propertyName,
                required: (!definition.required == undefined && definition.required.length > 0 && definition.required.indexOf(propertyName) >= 0),
                type: type,
            };
            if (definitionSchema.$ref) {
                swaggerSchema.$ref = definitionSchema.$ref;
                if (schema.length > 0) {
                    swaggerSchema.schema = schema;
                }
            }
            else if (definitionSchema.additionalProperties) {
                swaggerSchema.protoMap = definitionSchema.additionalProperties;
                if (schema.length > 0) {
                    swaggerSchema.protoMap.schema = schema;
                }
            }
            else if (definitionSchema.items) {
                swaggerSchema.protoArray = definitionSchema.items;
                if (schema.length > 0) {
                    swaggerSchema.protoArray.schema = schema;
                }
            }
            swaggerSchemaList.push(swaggerSchema);
        }
        return swaggerSchemaList;
    }
    Swagger.parseSwaggerDefinitionMap = parseSwaggerDefinitionMap;
})(Swagger = exports.Swagger || (exports.Swagger = {}));
//# sourceMappingURL=lib.js.map