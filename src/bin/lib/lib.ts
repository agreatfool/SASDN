import * as LibPath from "path";
import * as LibFs from "mz/fs";
import * as recursive from "recursive-readdir";
import * as protobuf from "protobufjs";
import {IParserResult, Method, Namespace, Service} from "protobufjs";
import * as bluebird from "bluebird";
import * as LibMkdirP from "mkdirp";
import {Operation as SwaggerOperation, Schema as SwaggerSchema, Spec as SwaggerSpec} from "swagger-schema-official";

const mkdirp = bluebird.promisify<string, string>(LibMkdirP);

/**
 * protoDir: /Users/XXX/Projects/projectX/proto
 * outputDir: /output/dir/specified
 * file: /Users/XXX/Projects/projectX/proto/dummy/your.proto
 *     => dummy/your.proto
 * protoFile.protoPath = /Users/XXX/Projects/projectX/proto
 * protoFile.relativePath = dummy
 * protoFile.fileName = your.proto
 * protoFile.filePath = dummy/your.proto
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

export interface ProtoInfo {
    proto: IParserResult;
    protoFile: ProtoFile;
}

export interface ProtoMsgImportInfo {
    msgType: string;
    protoFile: ProtoFile;
}

export interface ProtoMsgImportInfos {
    [msgTypeStr: string]: ProtoMsgImportInfo;
}

export interface RpcProtoServicesInfo {
    protoFile: ProtoFile;
    protoServiceImportPath: string;
    services: {
        [serviceName: string]: Array<RpcMethodInfo>;
    };
}

export interface RpcMethodInfo {
    callTypeStr: string;
    requestTypeStr: string;
    responseTypeStr: string;
    hasCallback: boolean;
    hasRequest: boolean;
    methodName: string;
    protoMsgImportPath: RpcMethodImportPathInfo;
}

export interface RpcMethodImportPathInfo {
    [importPath: string]: Array<string>;
}

export interface GatewaySwaggerSchema {
    name: string;
    type: string;           // string, number, array, object
    required: boolean;      // required, optional
    schema?: Array<GatewaySwaggerSchema>;
    refName?: string;
}
export interface SwaggerDefinitionMap {
    [definitionsName: string]: SwaggerSchema;
}

export const readProtoList = async function (protoDir: string, outputDir: string, excludes?: Array<string>): Promise<Array<ProtoFile>> {
    let files = await recursive(protoDir, ['.DS_Store', function ignoreFunc(file, stats) {
        let shallIgnore = false;
        if (!excludes || excludes.length === 0) {
            return shallIgnore;
        }
        excludes.forEach((exclude: string) => {
            if (file.indexOf(exclude) !== -1) {
                shallIgnore = true;
            }
        });
        return shallIgnore;
    }]);

    let protoFiles = files.map((file: string) => {
        let protoFile = {} as ProtoFile;

        file = file.replace(protoDir, ''); // remove base dir
        if (file.substr(0, 1) == '/') file = file.substr(1);
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

export const parseProto = async function (protoFile: ProtoFile): Promise<IParserResult> {
    let content = await LibFs.readFile(Proto.genFullProtoFilePath(protoFile));
    let proto = protobuf.parse(content.toString());

    return Promise.resolve(proto);
};

export const parseServicesFromProto = async function (proto: IParserResult): Promise<Array<Service>> {
    let pkgRoot = proto.root.lookup(proto.package) as Namespace;
    let services = [] as Array<Service>;
    let nestedKeys = Object.keys(pkgRoot.nested);
    nestedKeys.forEach((nestedKey) => {
        let nestedInstance = pkgRoot.nested[nestedKey];
        if (!(nestedInstance instanceof Service)) {
            return;
        }
        services.push(nestedInstance as Service);
    });

    return Promise.resolve(services);
};

export const parseMsgNamesFromProto = async function (proto: IParserResult, protoFile: ProtoFile): Promise<ProtoMsgImportInfos> {
    let pkgRoot = proto.root.lookup(proto.package) as Namespace;
    let msgImportInfos = {} as ProtoMsgImportInfos;
    let nestedKeys = Object.keys(pkgRoot.nested);
    nestedKeys.forEach((nestedKey) => {
        let msgTypeStr = pkgRoot.name + '.' + nestedKey;
        msgImportInfos[msgTypeStr] = {
            msgType: nestedKey,
            protoFile: protoFile
        } as ProtoMsgImportInfo;
    });

    return Promise.resolve(msgImportInfos);
};

export const genRpcMethodInfo = function(protoFile: ProtoFile, method: Method, outputPath: string, protoMsgImportInfos: ProtoMsgImportInfos) : RpcMethodInfo {

    let defaultImportPath = Proto.genProtoMsgImportPath(protoFile, outputPath);
    let protoMsgImportPaths = {} as RpcMethodImportPathInfo;

    let requestType = method.requestType;
    let requestTypeImportPath = defaultImportPath;
    if (protoMsgImportInfos.hasOwnProperty(method.requestType)) {
        requestType = protoMsgImportInfos[method.requestType].msgType;
        requestTypeImportPath = Proto.genProtoMsgImportPath(protoMsgImportInfos[method.requestType].protoFile, outputPath);
    }
    protoMsgImportPaths = parseImportPathInfos(protoMsgImportPaths, requestType, requestTypeImportPath);

    let responseType = method.responseType;
    let responseTypeImportPath = defaultImportPath;
    if (protoMsgImportInfos.hasOwnProperty(method.responseType)) {
        responseType = protoMsgImportInfos[method.requestType].msgType;
        responseTypeImportPath = Proto.genProtoMsgImportPath(protoMsgImportInfos[method.requestType].protoFile, outputPath);
    }
    protoMsgImportPaths = parseImportPathInfos(protoMsgImportPaths, responseType, responseTypeImportPath);

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

export const parseImportPathInfos = function (importPathInfos: RpcMethodImportPathInfo, type: string, importPath: string) : RpcMethodImportPathInfo {
    if (!importPathInfos.hasOwnProperty(importPath)) {
        importPathInfos[importPath] = [];
    }

    importPathInfos[importPath].push(type);

    return importPathInfos;
};

export const mkdir = async function (path: string): Promise<string> {
    return mkdirp(path);
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
        const depth = filePath.split("/").length;
        return depth === 1 ? "./" : new Array(depth).join("../");
    }

    /**
     * dummy/your.proto => dummy_your_pb
     * @param {string} filePath
     * @returns {string}
     */
    export const filePathToPseudoNamespace = function (filePath: string): string {
        return filePath.replace(".proto", "").replace(/\//g, "_").replace(/\./g, "_").replace(/-/g, "_") + "_pb";
    };

    /**
     * dummy/your.proto => dummy_your_grpc_pb
     * @param {string} filePath
     * @returns {string}
     */
    export function filePathToServiceNamespace(filePath: string): string {
        return filePath.replace(".proto", "").replace(/\//g, "_").replace(/\./g, "_").replace(/-/g, "_") + "_grpc_pb";
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
     * @param {string} serviceFilePath
     * @returns {string}
     */
    export const genProtoMsgImportPath = function (protoFile: ProtoFile, serviceFilePath: string): string {
        return LibPath.join(
            getPathToRoot(serviceFilePath.substr(serviceFilePath.indexOf('services'))),
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
    export const genFullOutputServicePath = function (protoFile: ProtoFile, service: Service, method: Method) {
        return LibPath.join(
            protoFile.outputPath,
            'services',
            protoFile.relativePath,
            protoFile.svcNamespace,
            service.name,
            lcfirst(method.name) + '.ts'
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
            if (file.indexOf(exclude) !== -1) {
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
                console.log("Error:" + e.message);
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
     * bookBookModel => BookModel
     *
     * @param {string} ref
     * @param {string} protoName
     * @returns {string}
     */
    export function removeProtoName(ref: string, protoName: string): string {
        return ref.replace(protoName, '');
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
     * Get swagger response type
     * <pre>
     *     1. getRefName
     *     #/definitions/bookBookMap => bookBookMap
     *     2. getSwaggerResponseType
     *     bookBookMap => BookMap
     * </pre>
     *
     * @param {SwaggerOperation} option
     * @param {string} protoName
     * @returns {string}
     */
    export function getSwaggerResponseType(option: SwaggerOperation, protoName: string): string {
        return Swagger.removeProtoName(Swagger.getRefName(option.responses[200].schema.$ref), protoName);
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
        let canDeepSearch = (level++ <= maxLevel);

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
                    schema = parseSwaggerDefinitionMap(definitionMap, Swagger.getRefName(definitionSchema.$ref), level);
                }
            } else if (definitionSchema.type) {
                type = Swagger.convertSwaggerTypeToJoiType(definitionSchema.type);
                if (definitionSchema.type === 'array' && definitionSchema.items.hasOwnProperty('$ref')) {
                    // is repeated field
                } else if (definitionSchema.type === 'object' && definitionSchema.additionalProperties) {
                    // is map field field
                    type = 'array';
                }
            } else {
                type = 'any';
            }

            let swaggerSchema: GatewaySwaggerSchema = {
                name: propertyName,
                required: (!definition.required == undefined && definition.required.length > 0 && definition.required.indexOf(propertyName) >= 0),
                type: type,
            };

            if (schema.length > 0) {
                swaggerSchema.schema = schema;
            }

            swaggerSchemaList.push(swaggerSchema);
        }

        return swaggerSchemaList;
    }

}