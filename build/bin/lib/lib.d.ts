import * as protobuf from "protobufjs";
import { Operation as SwaggerOperation, Schema as SwaggerSchema, Spec as SwaggerSpec } from "swagger-schema-official";
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
    protoMsgImportPath: string;
}
export interface GatewaySwaggerSchema {
    name: string;
    type: string;
    required: boolean;
    schema?: Array<GatewaySwaggerSchema>;
    refName?: string;
}
export interface SwaggerDefinitionMap {
    [definitionsName: string]: SwaggerSchema;
}
export declare const readProtoList: (protoDir: string, outputDir: string, excludes?: string[]) => Promise<ProtoFile[]>;
export declare const parseServicesFromProto: (protoFile: ProtoFile) => Promise<protobuf.Service[]>;
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
     * Generate full service stub code output path.
     * @param {ProtoFile} protoFile
     * @param {Service} service
     * @param {Method} method
     * @returns {string}
     */
    const genFullOutputServicePath: (protoFile: ProtoFile, service: protobuf.Service, method: protobuf.Method) => string;
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
     * bookBookModel => BookModel
     *
     * @param {string} ref
     * @param {string} protoName
     * @returns {string}
     */
    function removeProtoName(ref: string, protoName: string): string;
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
    function getSwaggerResponseType(option: SwaggerOperation, protoName: string): string;
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
