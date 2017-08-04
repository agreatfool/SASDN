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
const debug = require('debug')('SASDN:CLI:Gateway');
program.version(pkg.version)
    .option('-p, --proto <dir>', 'directory of proto files')
    .option('-s, --swagger <dir>', 'directory of swagger spec files')
    .option('-o, --output <dir>', 'directory to output service codes')
    .option('-i, --import <items>', 'third party proto import path: e.g path1,path2,path3', function list(val) {
    return val.split(',');
})
    .option('-c, --client', 'add -c to output API Gateway client codes')
    .parse(process.argv);
const PROTO_DIR = program.proto === undefined ? undefined : LibPath.normalize(program.proto);
const SWAGGER_DIR = program.swagger === undefined ? undefined : LibPath.normalize(program.swagger);
const OUTPUT_DIR = program.output === undefined ? undefined : LibPath.normalize(program.output);
const IMPORTS = program.import === undefined ? [] : program.import;
const API_GATEWAY_CLIENT = program.client !== undefined;
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
            debug('GatewayCLI start.');
            yield this._validate();
            yield this._loadProtos();
            yield this._loadSpecs();
            yield this._genSpecs();
        });
    }
    _validate() {
        return __awaiter(this, void 0, void 0, function* () {
            debug('GatewayCLI validate.');
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
            debug('ServiceCLI load proto files.');
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
            debug('GatewayCLI load swagger spec files.');
            this._swaggerList = yield lib_1.readSwaggerList(SWAGGER_DIR, OUTPUT_DIR);
            if (this._swaggerList.length === 0) {
                throw new Error('no valid swagger spec json found');
            }
        });
    }
    _genSpecs() {
        return __awaiter(this, void 0, void 0, function* () {
            debug('GatewayCLI generate router api codes.');
            let protoInfos = [];
            for (let i = 0; i < this._protoFiles.length; i++) {
                let protoFile = this._protoFiles[i];
                if (!protoFile) {
                    continue;
                }
                let protoInfo = {};
                protoInfo.proto = yield lib_1.parseProto(protoFile);
                protoInfo.protoFile = protoFile;
                protoInfos.push(protoInfo);
                let msgImportInfos = yield lib_1.parseMsgNamesFromProto(protoInfo.proto, protoFile, '');
                for (let msgTypeStr in msgImportInfos) {
                    this._protoMsgImportInfos[msgTypeStr] = msgImportInfos[msgTypeStr];
                }
            }
            let gatewayInfoList = [];
            for (let swaggerSpec of this._swaggerList) {
                debug(`GatewayCLI generate swagger spec: ${swaggerSpec.info.title}`);
                // Parse swagger definitions schema to ${Array<GatewaySwaggerSchema>}
                let gatewayDefinitionSchemaMap = {};
                for (let definitionName in swaggerSpec.definitions) {
                    gatewayDefinitionSchemaMap[definitionName] = lib_1.Swagger.parseSwaggerDefinitionMap(swaggerSpec.definitions, definitionName);
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
                        if (this._protoMsgImportInfos.hasOwnProperty(responseType)) {
                            let protoMsgImportInfo = this._protoMsgImportInfos[responseType];
                            responseType = protoMsgImportInfo.msgType;
                            protoMsgImportPaths = lib_1.parseImportPathInfos(protoMsgImportPaths, responseType, lib_1.Proto.genProtoMsgImportPathViaRouterPath(protoMsgImportInfo.protoFile, lib_1.Proto.genFullOutputRouterApiPath(protoMsgImportInfo.protoFile)).replace(/\\/g, '/'));
                        }
                        let requestType = false;
                        let funcParamsStr = '';
                        let aggParamsStr = '';
                        let requiredParamsStr = '';
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
                                        protoMsgImportPaths = lib_1.parseImportPathInfos(protoMsgImportPaths, requestType, lib_1.Proto.genProtoMsgImportPathViaRouterPath(protoMsgImportInfo.protoFile, lib_1.Proto.genFullOutputRouterApiPath(protoMsgImportInfo.protoFile)).replace(/\\/g, '/'));
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
                            funcParamsStr += (funcParamsStr == '') ? parameter.name : `, ${parameter.name}`;
                            aggParamsStr += (aggParamsStr == '') ? `'${parameter.name}'` : `, '${parameter.name}'`;
                            if (parameter.required) {
                                requiredParamsStr += (requiredParamsStr == '') ? `'${parameter.name}'` : `, '${parameter.name}'`;
                            }
                        }
                        gatewayInfoList.push({
                            apiName: lib_1.ucfirst(method) + methodOperation.operationId,
                            serviceName: methodOperation.tags[0],
                            fileName: lib_1.lcfirst(method) + methodOperation.operationId,
                            method: method,
                            uri: lib_1.Swagger.convertSwaggerUriToKoaUri(pathName),
                            parameters: swaggerSchemaList,
                            protoMsgImportPath: protoMsgImportPaths,
                            responseTypeStr: responseType,
                            requestTypeStr: requestType,
                            funcParamsStr: funcParamsStr,
                            aggParamsStr: aggParamsStr,
                            requiredParamsStr: requiredParamsStr,
                        });
                    }
                }
                // make router dir in OUTPUT_DIR
                yield lib_1.mkdir(LibPath.join(OUTPUT_DIR, 'router'));
                // write file Router.ts in OUTPUT_DIR/router/
                template_1.TplEngine.registerHelper('lcfirst', lib_1.lcfirst);
                let routerContent = template_1.TplEngine.render('router/router', {
                    infos: gatewayInfoList,
                });
                yield LibFs.writeFile(LibPath.join(OUTPUT_DIR, 'router', 'Router.ts'), routerContent);
                // write file ${gatewayApiName}.ts in OUTPUT_DIR/router/${gatewayApiService}/
                for (let gatewayInfo of gatewayInfoList) {
                    yield lib_1.mkdir(LibPath.join(OUTPUT_DIR, 'router', gatewayInfo.serviceName));
                    let apiContent = template_1.TplEngine.render('router/api', {
                        info: gatewayInfo,
                    });
                    yield LibFs.writeFile(LibPath.join(OUTPUT_DIR, 'router', gatewayInfo.serviceName, gatewayInfo.fileName + '.ts'), apiContent);
                }
                // make client dir in OUTPUT_DIR
                if (API_GATEWAY_CLIENT) {
                    yield lib_1.mkdir(LibPath.join(OUTPUT_DIR, 'client'));
                    // write file Router.ts in OUTPUT_DIR/router/
                    template_1.TplEngine.registerHelper('lcfirst', lib_1.lcfirst);
                    let clientContent = template_1.TplEngine.render('client/client', {
                        infos: gatewayInfoList,
                    });
                    yield LibFs.writeFile(LibPath.join(OUTPUT_DIR, 'client', 'sasdnAPI.ts'), clientContent);
                }
            }
        });
    }
}
GatewayCLI.instance().run().catch((err) => {
    debug('err: %O', err.message);
});
//# sourceMappingURL=sasdn-gateway.js.map