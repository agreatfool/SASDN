import * as LibPath from "path";
import * as LibFs from "mz/fs";
import * as recursive from "recursive-readdir";
import * as protobuf from "protobufjs";
import {Method, Namespace, Service} from "protobufjs";
import * as bluebird from "bluebird";
import * as LibMkdirP from "mkdirp";
import {Operation as SwaggerOperation, Schema as SwaggerSchema, Spec as SwaggerSpec} from "swagger-schema-official";
import {isUndefined} from "util";

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

export interface RpcProtoServicesInfo {
    protoFile: ProtoFile;
    protoServiceImportPath: string;
    services: { [serviceName: string]: Array<RpcMethodInfo> };
}

export interface RpcMethodInfo {
    callTypeStr: string;
    requestTypeStr: string;
    responseTypeStr: string;
    hasCallback: boolean;
    hasRequest: boolean;
    methodName: string;
    protoMsgImportPath: string;
}

export type GatewayParameter = {
    name: string;
    type: string;           // string, number, array, object, ANY INTERFACE
    required: boolean;      // required, optional
    schema?: GatewayParameterList;
    uri?: Array<string>;
}
export type GatewayParameterList = Array<GatewayParameter>
export type SwaggerDefinitionMap = { [definitionsName: string]: SwaggerSchema }

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

export const parseServicesFromProto = async function (protoFile: ProtoFile): Promise<Array<Service>> {
    let content = await LibFs.readFile(Proto.genFullProtoFilePath(protoFile));
    let proto = protobuf.parse(content.toString());
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

export const readSwaggerList = async function (swaggerDir: string, outputDir: string, excludes?: Array<string>): Promise<Array<SwaggerSpec>> {
    let files = await recursive(swaggerDir, ['.DS_Store', function(file) {
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
            } catch(e) {
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
     * #/definitions/BookModel => BookModel
     *
     * @param {string} ref
     * @returns {string}
     */
    export function getRefName(ref: string): string {
        return ref.replace('#/definitions/', '');
    }

    /**
     * convert SwaggerType To JoiType
     * <pre>
     *   integer => number
     * </pre>
     *
     * @param {string} type
     * @returns {string}
     */
    export function convertSwaggerTypeToJoiType(type: string): string {
        let enumTypes = {
            "integer":  "number",
            "number":   "number",
            "string":   "string",
            "boolean":  "boolean",
            "object":   "object",
            "array":    "array"
        };

        return enumTypes.hasOwnProperty(type) ? enumTypes[type] : "any";
    }

    /**
     * convert Swagger Uri to Koa Uri
     * <pre>
     *   /v1/book/{isbn}/{version} => /v1/book/:isbn/:version
     * </pre>
     *
     * @param uri
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
     *  #/definitions/bookBookMap => BookMap
     * </pre>
     *
     * @param {SwaggerOperation} option
     * @param {string} protoName
     * @returns {string}
     */
    export function getSwaggerResponseType(option: SwaggerOperation, protoName: string): string {
        return Swagger.getRefName(option.responses[200].schema.$ref).replace(protoName, '');
    }

    /**
     * Parse swagger definitions schema to {GatewayParameterList}
     *
     * @param {SwaggerDefinitionMap} definitionMap
     * @param {string} definitionName
     * @returns {GatewayParameterList}
     */
    export function parseSwaggerDefinitionMap(definitionMap: SwaggerDefinitionMap, definitionName: string): GatewayParameterList {
        let parameterList = [] as GatewayParameterList;

        if (definitionMap.hasOwnProperty(definitionName)) {
            let definition = definitionMap[definitionName] as SwaggerSchema;

            // key: string => value: SwaggerSchema
            for (let propertyName in definition.properties) {
                let definitionSchema = definition.properties[propertyName] as SwaggerSchema;

                let type: string;
                let schema: GatewayParameterList = [];
                if (definitionSchema.$ref) {
                    type = "object";
                    schema = parseSwaggerDefinitionMap(definitionMap, Swagger.getRefName(definitionSchema.$ref));
                } else if (definitionSchema.type) {
                    type = Swagger.convertSwaggerTypeToJoiType(definitionSchema.type);
                    if (definitionSchema.type == 'array' && definitionSchema.items.hasOwnProperty("$ref")) {
                        schema = parseSwaggerDefinitionMap(definitionMap, Swagger.getRefName(definitionSchema.items["$ref"]));
                    }
                } else {
                    type = "any";
                }

                let parameterSchema: GatewayParameter = {
                    name: propertyName,
                    required: (!isUndefined(definition.required) && definition.required.length > 0 && definition.required.indexOf(propertyName) >= 0),
                    type: type
                };

                if (schema.length > 0) {
                    parameterSchema.schema = schema
                }

                parameterList.push(parameterSchema);
            }
        }

        return parameterList
    }

}