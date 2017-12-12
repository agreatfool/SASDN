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
const LibFs = require("mz/fs");
const program = require("commander");
const LibPath = require("path");
const lib_1 = require("./lib/lib");
const template_1 = require("./lib/template");
const pkg = require('../../package.json');
program.version(pkg.version)
    .option('-p, --proto <dir>', 'directory of proto files')
    .option('-s, --swagger <dir>', 'directory of swagger spec files')
    .option('-o, --output <dir>', 'directory to output service codes')
    .option('-i, --import <items>', 'third party proto import path: e.g path1,path2,path3', function list(val) {
    return val.split(',');
})
    .option('-d, --deepSearchLevel <number>', 'add -d to parse swagger definition depth, default: 5')
    .option('-c, --client', 'add -c to output API Gateway client codes')
    .option('-fc, --firstCall <code>', 'add some code to run at start of handle')
    .parse(process.argv);
const PROTO_DIR = program.proto === undefined ? undefined : LibPath.normalize(program.proto);
const SWAGGER_DIR = program.swagger === undefined ? undefined : LibPath.normalize(program.swagger);
const OUTPUT_DIR = program.output === undefined ? undefined : LibPath.normalize(program.output);
const IMPORTS = program.import === undefined ? [] : program.import;
const DEEP_SEARCH_LEVEL = program.deepSearchLevel === undefined ? 5 : program.deepSearchLevel;
const API_GATEWAY_CLIENT = program.client !== undefined;
const FIRST_CALL_CODE = program.firstCall === undefined ? undefined : program.firstCall;
const METHOD_OPTIONS = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch'];
class GatewayCLI {
    constructor() {
        this._protoFiles = [];
        this._swaggerList = [];
        this._protoMsgImportInfos = {};
    }
    static instance() {
        return new GatewayCLI();
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('GatewayCLI start.');
            yield this._validate();
            yield this._loadProtos();
            yield this._loadSpecs();
            yield this._genSpecs();
        });
    }
    _validate() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('GatewayCLI validate.');
            if (!PROTO_DIR) {
                throw new Error('--proto is required');
            }
            if (!SWAGGER_DIR) {
                throw new Error('--swagger is required');
            }
            if (!OUTPUT_DIR) {
                throw new Error('--output is required');
            }
            let protoStat = yield LibFs.stat(PROTO_DIR);
            if (!protoStat.isDirectory()) {
                throw new Error('--proto is not a directory');
            }
            let swaggerStat = yield LibFs.stat(SWAGGER_DIR);
            if (!swaggerStat.isDirectory()) {
                throw new Error('--swagger is not a directory');
            }
            let outputStat = yield LibFs.stat(OUTPUT_DIR);
            if (!outputStat.isDirectory()) {
                throw new Error('--output is not a directory');
            }
        });
    }
    _loadProtos() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('ServiceCLI load result files.');
            this._protoFiles = yield lib_1.readProtoList(PROTO_DIR, OUTPUT_DIR);
            if (IMPORTS.length > 0) {
                for (let i = 0; i < IMPORTS.length; i++) {
                    this._protoFiles = this._protoFiles.concat(yield lib_1.readProtoList(LibPath.normalize(IMPORTS[i]), OUTPUT_DIR));
                }
            }
            if (this._protoFiles.length === 0) {
                throw new Error('no proto files found');
            }
        });
    }
    _loadSpecs() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('GatewayCLI load swagger spec files.');
            this._swaggerList = yield lib_1.readSwaggerList(SWAGGER_DIR, OUTPUT_DIR);
            if (this._swaggerList.length === 0) {
                throw new Error('no valid swagger spec json found');
            }
        });
    }
    _genSpecs() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('GatewayCLI generate router api codes.');
            // 从 proto 文件中解析出 ProtobufIParserResult 数据
            let parseResults = [];
            for (let i = 0; i < this._protoFiles.length; i++) {
                let protoFile = this._protoFiles[i];
                if (!protoFile) {
                    continue;
                }
                let parseResult = {};
                parseResult.result = yield lib_1.parseProto(protoFile);
                parseResult.protoFile = protoFile;
                parseResults.push(parseResult);
                let msgImportInfos = lib_1.parseMsgNamesFromProto(parseResult.result, protoFile, '');
                for (let msgTypeStr in msgImportInfos) {
                    this._protoMsgImportInfos[msgTypeStr] = msgImportInfos[msgTypeStr];
                }
            }
            let gatewayInfoList = [];
            for (let swaggerSpec of this._swaggerList) {
                console.log(`GatewayCLI generate swagger spec: ${swaggerSpec.info.title}`);
                // Parse swagger definitions schema to ${Array<GatewaySwaggerSchema>}
                let gatewayDefinitionSchemaMap = {};
                for (let definitionName in swaggerSpec.definitions) {
                    gatewayDefinitionSchemaMap[definitionName] = lib_1.Swagger.parseSwaggerDefinitionMap(swaggerSpec.definitions, definitionName, 1, DEEP_SEARCH_LEVEL);
                }
                // Loop paths uri
                for (let pathName in swaggerSpec.paths) {
                    let swaggerPath = swaggerSpec.paths[pathName];
                    // method: GET, PUT, POST, DELETE, OPTIONS, HEAD, PATCH
                    for (let method in swaggerPath) {
                        // not a method operation
                        if (METHOD_OPTIONS.indexOf(method) < 0) {
                            continue;
                        }
                        // read method operation
                        let methodOperation = swaggerPath[method];
                        let protoMsgImportPaths = {};
                        // loop method parameters
                        let swaggerSchemaList = [];
                        // responseType handler
                        let responseType = lib_1.Swagger.getRefName(methodOperation.responses[200].schema.$ref);
                        let responseParameters = gatewayDefinitionSchemaMap[responseType];
                        if (this._protoMsgImportInfos.hasOwnProperty(responseType)) {
                            let protoMsgImportInfo = this._protoMsgImportInfos[responseType];
                            responseType = protoMsgImportInfo.msgType;
                            protoMsgImportPaths = lib_1.addIntoRpcMethodImportPathInfos(protoMsgImportPaths, responseType, lib_1.Proto.genProtoMsgImportPathViaRouterPath(protoMsgImportInfo.protoFile, lib_1.Proto.genFullOutputRouterApiPath(protoMsgImportInfo.protoFile)).replace(/\\/g, '/'));
                        }
                        let requestType = '';
                        let funcParamsStr = '';
                        let aggParamsStr = '';
                        let requiredParamsStr = '';
                        // 循环解析 parameters 字段，并将字段类型和 schema 结构加入到 swaggerSchemaList。
                        for (let parameter of methodOperation.parameters) {
                            let type;
                            let schema = [];
                            switch (parameter.in) {
                                case 'body':
                                    let definitionName = lib_1.Swagger.getRefName(parameter.schema.$ref);
                                    type = 'object';
                                    schema = gatewayDefinitionSchemaMap[definitionName];
                                    if (this._protoMsgImportInfos.hasOwnProperty(definitionName)) {
                                        let protoMsgImportInfo = this._protoMsgImportInfos[definitionName];
                                        requestType = protoMsgImportInfo.msgType;
                                        protoMsgImportPaths = lib_1.addIntoRpcMethodImportPathInfos(protoMsgImportPaths, requestType, lib_1.Proto.genProtoMsgImportPathViaRouterPath(protoMsgImportInfo.protoFile, lib_1.Proto.genFullOutputRouterApiPath(protoMsgImportInfo.protoFile)).replace(/\\/g, '/'));
                                    }
                                    break;
                                case 'query':
                                case 'path':
                                    type = parameter.type;
                                    break;
                                default:
                                    type = 'any'; // headParameter, formDataParameter
                                    break;
                            }
                            let swaggerSchema = {
                                name: parameter.name,
                                required: parameter.required,
                                type: type,
                            };
                            if (schema.length > 0) {
                                swaggerSchema.schema = schema;
                            }
                            swaggerSchemaList.push(swaggerSchema);
                            funcParamsStr += (funcParamsStr === '') ? parameter.name : `, ${parameter.name}`;
                            aggParamsStr += (aggParamsStr === '') ? `'${parameter.name}'` : `, '${parameter.name}'`;
                            if (parameter.required) {
                                requiredParamsStr += (requiredParamsStr == '') ? `'${parameter.name}'` : `, '${parameter.name}'`;
                            }
                        }
                        // 循环解析 response 的 definitions 数据，将需要 import 的文件和类名加入到 RpcMethodImportPathInfos 列表数据中。
                        for (let i in responseParameters) {
                            const responseParameter = responseParameters[i];
                            if (responseParameter.hasOwnProperty('$ref')
                                || (responseParameter.protoArray && responseParameter.protoArray.hasOwnProperty('$ref'))
                                || (responseParameter.protoMap && responseParameter.protoMap.hasOwnProperty('$ref'))) {
                                let definitionName;
                                if (responseParameter.protoArray && responseParameter.protoArray.hasOwnProperty('$ref')) {
                                    definitionName = lib_1.Swagger.getRefName(responseParameter.protoArray['$ref']);
                                }
                                else if (responseParameter.protoMap && responseParameter.protoMap.hasOwnProperty('$ref')) {
                                    definitionName = lib_1.Swagger.getRefName(responseParameter.protoMap['$ref']);
                                }
                                else {
                                    definitionName = lib_1.Swagger.getRefName(responseParameter['$ref']);
                                }
                                if (this._protoMsgImportInfos.hasOwnProperty(definitionName)) {
                                    let protoMsgImportInfo = this._protoMsgImportInfos[definitionName];
                                    if (responseParameter.protoArray && responseParameter.protoArray.hasOwnProperty('$ref')) {
                                        responseParameter.protoArray['$ref'] = protoMsgImportInfo.msgType;
                                    }
                                    else if (responseParameter.protoMap && responseParameter.protoMap.hasOwnProperty('$ref')) {
                                        responseParameter.protoMap['$ref'] = protoMsgImportInfo.msgType;
                                    }
                                    else {
                                        responseParameter['$ref'] = protoMsgImportInfo.msgType;
                                    }
                                    protoMsgImportPaths = lib_1.addIntoRpcMethodImportPathInfos(protoMsgImportPaths, protoMsgImportInfo.msgType, lib_1.Proto.genProtoMsgImportPathViaRouterPath(protoMsgImportInfo.protoFile, lib_1.Proto.genFullOutputRouterApiPath(protoMsgImportInfo.protoFile)).replace(/\\/g, '/'));
                                }
                            }
                            responseParameters[i] = responseParameter;
                        }
                        gatewayInfoList.push({
                            apiName: lib_1.ucfirst(method) + methodOperation.operationId,
                            serviceName: methodOperation.tags[0],
                            fileName: lib_1.lcfirst(method) + methodOperation.operationId,
                            packageName: swaggerSpec.info.title.split('/')[0],
                            method: method,
                            uri: lib_1.Swagger.convertSwaggerUriToKoaUri(pathName),
                            protoMsgImportPath: protoMsgImportPaths,
                            funcParamsStr: funcParamsStr,
                            aggParamsStr: aggParamsStr,
                            requiredParamsStr: requiredParamsStr,
                            requestTypeStr: requestType,
                            requestParameters: swaggerSchemaList,
                            responseTypeStr: responseType,
                            responseParameters: responseParameters,
                            firstCallCode: FIRST_CALL_CODE,
                        });
                    }
                }
                // make router dir in OUTPUT_DIR
                yield lib_1.mkdir(LibPath.join(OUTPUT_DIR, 'router'));
                // TplEngine RegisterHelper
                template_1.TplEngine.registerHelper('lcfirst', lib_1.lcfirst);
                template_1.TplEngine.registerHelper('equal', function (v1, v2, options) {
                    if (v1 === v2) {
                        return options.fn(this);
                    }
                    else {
                        return options.inverse(this);
                    }
                });
                template_1.TplEngine.registerHelper('hump', function (str, type) {
                    let name = '';
                    let tmp = str.split('_');
                    for (let i = 0; i < tmp.length; i++) {
                        if (i > 0 || type == 'ucfirst') {
                            name += tmp[i].charAt(0).toUpperCase() + tmp[i].slice(1);
                        }
                        else {
                            name += tmp[i];
                        }
                    }
                    return name;
                });
                // write file Router.ts in OUTPUT_DIR/router/
                let routerContent = template_1.TplEngine.render('router/router', {
                    infos: gatewayInfoList,
                });
                yield LibFs.writeFile(LibPath.join(OUTPUT_DIR, 'router', 'Router.ts'), routerContent);
                // write file RouterAPITest.ts in OUTPUT_DIR/router/
                let testContent = template_1.TplEngine.render('router/test', {
                    infos: gatewayInfoList,
                });
                yield LibFs.writeFile(LibPath.join(OUTPUT_DIR, 'router', 'RouterAPITest.ts'), testContent);
                // write file ${gatewayApiName}.ts in OUTPUT_DIR/router/${gatewayApiService}/
                for (let gatewayInfo of gatewayInfoList) {
                    const relativePath = this._protoMsgImportInfos[`${gatewayInfo.packageName}${gatewayInfo.serviceName}`].protoFile.relativePath;
                    yield lib_1.mkdir(LibPath.join(OUTPUT_DIR, 'router', relativePath, gatewayInfo.serviceName));
                    let apiContent = template_1.TplEngine.render('router/api', {
                        info: gatewayInfo,
                    });
                    yield LibFs.writeFile(LibPath.join(OUTPUT_DIR, 'router', relativePath, gatewayInfo.serviceName, gatewayInfo.fileName + '.ts'), apiContent);
                }
                // make client dir in OUTPUT_DIR
                if (API_GATEWAY_CLIENT) {
                    yield lib_1.mkdir(LibPath.join(OUTPUT_DIR, 'client'));
                    // write file Router.ts in OUTPUT_DIR/router/
                    template_1.TplEngine.registerHelper('lcfirst', lib_1.lcfirst);
                    let clientContent = template_1.TplEngine.render('client/client', {
                        infos: gatewayInfoList,
                    });
                    yield LibFs.writeFile(LibPath.join(OUTPUT_DIR, 'client', 'SasdnAPI.ts'), clientContent);
                }
            }
        });
    }
}
GatewayCLI.instance().run().catch((err) => {
    console.log('err: ', err.message);
});
//# sourceMappingURL=sasdn-gateway.js.map