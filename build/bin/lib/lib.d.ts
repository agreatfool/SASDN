import * as protobuf from "protobufjs";
import { IParserResult as ProtobufIParserResult } from "protobufjs";
import { Schema as SwaggerSchema, Spec as SwaggerSpec } from "swagger-schema-official";
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
export interface RpcMethodImportPathInfo {
    [importPath: string]: Array<string>;
}
export interface GatewaySwaggerSchema {
    name: string;
    type: string;
    required: boolean;
    schema?: Array<GatewaySwaggerSchema>;
}
export interface SwaggerDefinitionMap {
    [definitionsName: string]: SwaggerSchema;
}
export declare const readProtoList: (protoDir: string, outputDir: string, excludes?: string[]) => Promise<ProtoFile[]>;
export declare const parseProto: (protoFile: ProtoFile) => Promise<protobuf.IParserResult>;
export declare const parseServicesFromProto: (proto: protobuf.IParserResult) => protobuf.Service[];
export declare const parseMsgNamesFromProto: (proto: protobuf.IParserResult, protoFile: ProtoFile, symlink?: string) => ProtoMsgImportInfos;
export declare const genRpcMethodInfo: (protoFile: ProtoFile, method: protobuf.Method, outputPath: string, protoMsgImportInfos: ProtoMsgImportInfos) => RpcMethodInfo;
export declare const parseImportPathInfos: (importPathInfos: RpcMethodImportPathInfo, type: string, importPath: string) => RpcMethodImportPathInfo;
export declare const mkdir: (path: string) => Promise<string>;
export declare const lcfirst: (str: any) => string;
export declare const ucfirst: (str: any) => string;
export declare namespace Proto {
    /**
     * dummy/your.proto => ../
     * dummy/and/dummy/your.proto => ../../../
     * @param {string} filePath
     * @returns {string}
     */
    function getPathToRoot(filePath: string): string;
    /**
     * dummy/your.proto => dummy_your_pb
     * @param {string} filePath
     * @returns {string}
     */
    const filePathToPseudoNamespace: (filePath: string) => string;
    /**
     * dummy/your.proto => dummy_your_grpc_pb
     * @param {string} filePath
     * @returns {string}
     */
    function filePathToServiceNamespace(filePath: string): string;
    /**
     * Generate service proto js file (e.g *_grpc_pb.js) import path.
     * Source code is "register.ts", service proto js import path is relative to it.
     * @param {ProtoFile} protoFile
     * @returns {string}
     */
    const genProtoServiceImportPath: (protoFile: ProtoFile) => string;
    /**
     * Generate origin protobuf definition (e.g *.proto) full file path.
     * @param {ProtoFile} protoFile
     * @returns {string}
     */
    const genFullProtoFilePath: (protoFile: ProtoFile) => string;
    /**
     * Generate message proto js file (e.g *_pb.js) import path.
     * Source code path is generated with {@link genFullOutputServicePath},
     * message proto js import path is relative to it.
     * @param {ProtoFile} protoFile
     * @param {string} serviceFilePath
     * @returns {string}
     */
    const genProtoMsgImportPath: (protoFile: ProtoFile, serviceFilePath: string) => string;
    /**
     * Generate message result js file (e.g *_pb.js) import path.
     * Source code path is generated with {@link genFullOutputServicePath},
     * message result js import path is relative to it.
     * @param {ProtoFile} protoFile
     * @param {string} routerDirPath
     * @returns {string}
     */
    const genProtoMsgImportPathViaRouterPath: (protoFile: ProtoFile, routerDirPath: string) => string;
    /**
     * Generate full service stub code output path.
     * @param {ProtoFile} protoFile
     * @param {Service} service
     * @param {Method} method
     * @returns {string}
     */
    const genFullOutputServicePath: (protoFile: ProtoFile, service: protobuf.Service, method: protobuf.Method) => string;
    /**
     * Generate full service stub code output dir.
     * @param {ProtoFile} protoFile
     * @param {string} serviceName
     * @param {string} apiName
     * @returns {string}
     */
    const genFullOutputRouterApiPath: (protoFile: ProtoFile, serviceName?: string, apiName?: string) => string;
}
/**
 * Read Swagger spec schema from swagger dir
 *
 * @param {string} swaggerDir
 * @param {string} outputDir
 * @param {Array<string>} excludes, optional param
 * @returns {Promise<Array<SwaggerSpec>>}
 */
export declare const readSwaggerList: (swaggerDir: string, outputDir: string, excludes?: string[]) => Promise<SwaggerSpec[]>;
export declare namespace Swagger {
    /**
     * #/definitions/bookBookModel => bookBookModel
     *
     * @param {string} ref
     * @returns {string}
     */
    function getRefName(ref: string): string;
    /**
     * Convert SwaggerType To JoiType
     * <pre>
     *   integer => number
     * </pre>
     *
     * @param {string} type
     * @returns {string}
     */
    function convertSwaggerTypeToJoiType(type: string): string;
    /**
     * Convert Swagger Uri to Koa Uri
     * <pre>
     *   /v1/book/{isbn}/{version} => /v1/book/:isbn/:version
     * </pre>
     *
     * @param {string} uri
     * @returns {string}
     */
    function convertSwaggerUriToKoaUri(uri: string): string;
    /**
     * Parse swagger definitions schema to Array<GatewaySwaggerSchema>
     *
     * @param {SwaggerDefinitionMap} definitionMap
     * @param {string} definitionName
     * @param {number} level, Current loop definitionMap level
     * @param {number} maxLevel, Max loop definitionMap level count
     * @returns {Array<GatewaySwaggerSchema>}
     */
    function parseSwaggerDefinitionMap(definitionMap: SwaggerDefinitionMap, definitionName: string, level?: number, maxLevel?: number): Array<GatewaySwaggerSchema>;
}
