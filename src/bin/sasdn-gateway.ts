import * as LibFs from 'mz/fs';
import * as program from 'commander';
import * as LibPath from 'path';
import {
    BodyParameter,
    Operation,
    Path,
    PathParameter,
    QueryParameter,
    Spec as SwaggerSpec
} from 'swagger-schema-official';
import {
    GatewaySwaggerSchema,
    lcfirst,
    mkdir,
    parseImportPathInfos,
    parseMsgNamesFromProto,
    parseProto,
    Proto,
    ProtoFile,
    ProtoParseResult,
    ProtoMsgImportInfos,
    readProtoList,
    readSwaggerList,
    RpcMethodImportPathInfo,
    Swagger,
    ucfirst
} from './lib/lib';
import {TplEngine} from './lib/template';

const pkg = require('../../package.json');

interface GatewayInfo {
    apiName: string;
    serviceName: string;
    fileName: string;
    packageName: string;
    method: string;
    uri: string;
    protoMsgImportPath: RpcMethodImportPathInfo;
    funcParamsStr: string;
    aggParamsStr: string;
    requiredParamsStr: string;
    requestTypeStr: string | boolean;
    requestParameters: Array<GatewaySwaggerSchema>;
    responseTypeStr: string;
    responseParameters: Array<GatewaySwaggerSchema>;
}

interface GatewayDefinitionSchemaMap {
    [definitionName: string]: Array<GatewaySwaggerSchema>;
}

program.version(pkg.version)
    .option('-p, --proto <dir>', 'directory of proto files')
    .option('-s, --swagger <dir>', 'directory of swagger spec files')
    .option('-o, --output <dir>', 'directory to output service codes')
    .option('-i, --import <items>', 'third party proto import path: e.g path1,path2,path3', function list(val) {
        return val.split(',');
    })
    .option('-c, --client', 'add -c to output API Gateway client codes')
    .parse(process.argv);

const PROTO_DIR = (program as any).proto === undefined ? undefined : LibPath.normalize((program as any).proto);
const SWAGGER_DIR = (program as any).swagger === undefined ? undefined : LibPath.normalize((program as any).swagger);
const OUTPUT_DIR = (program as any).output === undefined ? undefined : LibPath.normalize((program as any).output);
const IMPORTS = (program as any).import === undefined ? [] : (program as any).import;
const API_GATEWAY_CLIENT = (program as any).client !== undefined;
const METHOD_OPTIONS = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch'];

class GatewayCLI {
    private _protoFiles: Array<ProtoFile> = [];
    private _swaggerList: Array<SwaggerSpec> = [];
    private _protoMsgImportInfos: ProtoMsgImportInfos = {};

    static instance() {
        return new GatewayCLI();
    }

    public async run() {
        console.log('GatewayCLI start.');
        await this._validate();
        await this._loadProtos();
        await this._loadSpecs();
        await this._genSpecs();
    }

    private async _validate() {
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

        let protoStat = await LibFs.stat(PROTO_DIR);
        if (!protoStat.isDirectory()) {
            throw new Error('--proto is not a directory');
        }
        let swaggerStat = await LibFs.stat(SWAGGER_DIR);
        if (!swaggerStat.isDirectory()) {
            throw new Error('--swagger is not a directory');
        }
        let outputStat = await LibFs.stat(OUTPUT_DIR);
        if (!outputStat.isDirectory()) {
            throw new Error('--output is not a directory');
        }
    }

    private async _loadProtos() {
        console.log('ServiceCLI load result files.');

        this._protoFiles = await readProtoList(PROTO_DIR, OUTPUT_DIR);
        if (IMPORTS.length > 0) {
            for (let i = 0; i < IMPORTS.length; i++) {
                this._protoFiles = this._protoFiles.concat(await readProtoList(LibPath.normalize(IMPORTS[i]), OUTPUT_DIR));
            }
        }
        if (this._protoFiles.length === 0) {
            throw new Error('no proto files found');
        }
    }

    private async _loadSpecs() {
        console.log('GatewayCLI load swagger spec files.');

        this._swaggerList = await readSwaggerList(SWAGGER_DIR, OUTPUT_DIR);
        if (this._swaggerList.length === 0) {
            throw new Error('no valid swagger spec json found');
        }
    }

    private async _genSpecs() {
        console.log('GatewayCLI generate router api codes.');

        let parseResults = [] as Array<ProtoParseResult>;
        for (let i = 0; i < this._protoFiles.length; i++) {
            let protoFile = this._protoFiles[i];
            if (!protoFile) {
                continue;
            }
            let parseResult = {} as ProtoParseResult;
            parseResult.result = await parseProto(protoFile);
            parseResult.protoFile = protoFile;
            parseResults.push(parseResult);

            let msgImportInfos = parseMsgNamesFromProto(parseResult.result, protoFile, '');
            for (let msgTypeStr in msgImportInfos) {
                this._protoMsgImportInfos[msgTypeStr] = msgImportInfos[msgTypeStr];
            }
        }

        let gatewayInfoList = [] as Array<GatewayInfo>;

        for (let swaggerSpec of this._swaggerList) {
            console.log(`GatewayCLI generate swagger spec: ${swaggerSpec.info.title}`);

            // Parse swagger definitions schema to ${Array<GatewaySwaggerSchema>}
            let gatewayDefinitionSchemaMap = {} as GatewayDefinitionSchemaMap;
            for (let definitionName in swaggerSpec.definitions) {
                gatewayDefinitionSchemaMap[definitionName] = Swagger.parseSwaggerDefinitionMap(swaggerSpec.definitions, definitionName);
            }

            // Loop paths uri
            for (let pathName in swaggerSpec.paths) {
                let swaggerPath = swaggerSpec.paths[pathName] as Path;

                // method: GET, PUT, POST, DELETE, OPTIONS, HEAD, PATCH
                for (let method in swaggerPath) {

                    // not a method operation
                    if (METHOD_OPTIONS.indexOf(method) < 0) {
                        continue;
                    }

                    // read method operation
                    let methodOperation = swaggerPath[method] as Operation;
                    let protoMsgImportPaths = {} as RpcMethodImportPathInfo;

                    // loop method parameters
                    let swaggerSchemaList = [] as Array<GatewaySwaggerSchema>;

                    // responseType handler
                    let responseType = Swagger.getRefName(methodOperation.responses[200].schema.$ref);
                    let responseParameters = gatewayDefinitionSchemaMap[responseType];

                    if (this._protoMsgImportInfos.hasOwnProperty(responseType)) {
                        let protoMsgImportInfo = this._protoMsgImportInfos[responseType];
                        responseType = protoMsgImportInfo.msgType;
                        protoMsgImportPaths = parseImportPathInfos(
                            protoMsgImportPaths,
                            responseType,
                            Proto.genProtoMsgImportPathViaRouterPath(
                                protoMsgImportInfo.protoFile,
                                Proto.genFullOutputRouterApiPath(protoMsgImportInfo.protoFile)
                            ).replace(/\\/g, '/')
                        );
                    }

                    let requestType: string | boolean = false;
                    let funcParamsStr: string = '';
                    let aggParamsStr: string = '';
                    let requiredParamsStr: string = '';

                    for (let parameter of methodOperation.parameters) {

                        let type: string;
                        let schema: Array<GatewaySwaggerSchema> = [];

                        switch (parameter.in) {
                            case 'body':
                                let definitionName = Swagger.getRefName((parameter as BodyParameter).schema.$ref);
                                type = 'object';
                                schema = gatewayDefinitionSchemaMap[definitionName];

                                if (this._protoMsgImportInfos.hasOwnProperty(definitionName)) {
                                    let protoMsgImportInfo = this._protoMsgImportInfos[definitionName];
                                    requestType = protoMsgImportInfo.msgType;
                                    protoMsgImportPaths = parseImportPathInfos(
                                        protoMsgImportPaths,
                                        requestType as string,
                                        Proto.genProtoMsgImportPathViaRouterPath(
                                            protoMsgImportInfo.protoFile,
                                            Proto.genFullOutputRouterApiPath(protoMsgImportInfo.protoFile)
                                        ).replace(/\\/g, '/')
                                    );
                                }

                                break;
                            case 'query':
                            case 'path':
                                type = (parameter as QueryParameter | PathParameter).type;
                                break;
                            default:
                                type = 'any'; // headParameter, formDataParameter
                                break;
                        }

                        let swaggerSchema: GatewaySwaggerSchema = {
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

                    // response definitions import
                    for (let i in responseParameters) {
                        if (responseParameters[i].hasOwnProperty('$ref')
                            || (responseParameters[i].items && responseParameters[i].items.hasOwnProperty('$ref'))
                            || (responseParameters[i].additionalProperties && responseParameters[i].additionalProperties.hasOwnProperty('$ref'))) {

                            let definitionName: string;
                            if (responseParameters[i].items && responseParameters[i].items.hasOwnProperty('$ref')) {
                                definitionName = Swagger.getRefName(responseParameters[i].items['$ref']);
                            } else if (responseParameters[i].additionalProperties && responseParameters[i].additionalProperties.hasOwnProperty('$ref')) {
                                definitionName = Swagger.getRefName(responseParameters[i].additionalProperties['$ref']);
                            } else {
                                definitionName = Swagger.getRefName(responseParameters[i]['$ref']);
                            }

                            if (this._protoMsgImportInfos.hasOwnProperty(definitionName)) {
                                let protoMsgImportInfo = this._protoMsgImportInfos[definitionName];
                                if (responseParameters[i].items && responseParameters[i].items.hasOwnProperty('$ref')) {
                                    responseParameters[i].items['$ref'] = protoMsgImportInfo.msgType;
                                } else if (responseParameters[i].additionalProperties && responseParameters[i].additionalProperties.hasOwnProperty('$ref')) {
                                    responseParameters[i].additionalProperties['$ref'] = protoMsgImportInfo.msgType;
                                } else {
                                    responseParameters[i]['$ref'] = protoMsgImportInfo.msgType;
                                }

                                protoMsgImportPaths = parseImportPathInfos(
                                    protoMsgImportPaths,
                                    protoMsgImportInfo.msgType,
                                    Proto.genProtoMsgImportPathViaRouterPath(
                                        protoMsgImportInfo.protoFile,
                                        Proto.genFullOutputRouterApiPath(protoMsgImportInfo.protoFile)
                                    ).replace(/\\/g, '/')
                                );
                            }
                        }
                    }

                    gatewayInfoList.push({
                        apiName: ucfirst(method) + methodOperation.operationId,
                        serviceName: methodOperation.tags[0],
                        fileName: lcfirst(method) + methodOperation.operationId,
                        packageName: swaggerSpec.info.title.split('/')[0],
                        method: method,
                        uri: Swagger.convertSwaggerUriToKoaUri(pathName),
                        protoMsgImportPath: protoMsgImportPaths,
                        funcParamsStr: funcParamsStr,
                        aggParamsStr: aggParamsStr,
                        requiredParamsStr: requiredParamsStr,
                        requestTypeStr: requestType,
                        requestParameters: swaggerSchemaList,
                        responseTypeStr: responseType,
                        responseParameters: responseParameters,
                    });
                }
            }

            // make router dir in OUTPUT_DIR
            await mkdir(LibPath.join(OUTPUT_DIR, 'router'));

            // write file Router.ts in OUTPUT_DIR/router/
            TplEngine.registerHelper('lcfirst', lcfirst);
            let routerContent = TplEngine.render('router/router', {
                infos: gatewayInfoList,
            });
            await LibFs.writeFile(LibPath.join(OUTPUT_DIR, 'router', 'Router.ts'), routerContent);

            // write file ${gatewayApiName}.ts in OUTPUT_DIR/router/${gatewayApiService}/
            for (let gatewayInfo of gatewayInfoList) {
                const relativePath = this._protoMsgImportInfos[`${gatewayInfo.packageName}${gatewayInfo.serviceName}`].protoFile.relativePath;
                await mkdir(LibPath.join(OUTPUT_DIR, 'router', relativePath, gatewayInfo.serviceName));

                let apiContent = TplEngine.render('router/api', {
                    info: gatewayInfo,
                });

                await LibFs.writeFile(LibPath.join(OUTPUT_DIR, 'router', relativePath, gatewayInfo.serviceName, gatewayInfo.fileName + '.ts'), apiContent);
            }

            // make client dir in OUTPUT_DIR
            if (API_GATEWAY_CLIENT) {
                await mkdir(LibPath.join(OUTPUT_DIR, 'client'));

                // write file Router.ts in OUTPUT_DIR/router/
                TplEngine.registerHelper('lcfirst', lcfirst);
                let clientContent = TplEngine.render('client/client', {
                    infos: gatewayInfoList,
                });
                await LibFs.writeFile(LibPath.join(OUTPUT_DIR, 'client', 'SasdnAPI.ts'), clientContent);
            }
        }
    }
}

GatewayCLI.instance().run().catch((err: Error) => {
    console.log('err: ', err.message);
});