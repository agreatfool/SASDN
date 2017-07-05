import * as LibFs from "mz/fs";
import * as program from "commander";
import * as LibPath from "path";
import {
    BodyParameter,
    Operation,
    Path,
    PathParameter,
    QueryParameter,
    Spec as SwaggerSpec
} from "swagger-schema-official";
import {
    lcfirst, ucfirst, mkdir, readSwaggerList, readProtoList,
    GatewaySwaggerSchema, ProtoFile, Swagger, ProtoMsgImportInfos, ProtoInfo, parseProto, parseMsgNamesFromProto, Proto,
    RpcMethodImportPathInfo, parseImportPathInfos
} from "./lib/lib";
import {TplEngine} from "./lib/template";

const pkg = require('../../package.json');
const debug = require('debug')('SASDN:CLI:Gateway');

interface GatewayInfo {
    apiName: string;
    serviceName: string;
    fileName: string;
    method: string;
    uri: string;
    parameters: Array<GatewaySwaggerSchema>;
    protoMsgImportPath: RpcMethodImportPathInfo;
    responseTypeStr: string;
    requestTypeStr: string | boolean;
}

interface GatewayDefinitionSchemaMap {
    [definitionName: string]: Array<GatewaySwaggerSchema>;
}

program.version(pkg.version)
    .option('-p, --proto <dir>', 'directory of proto files')
    .option('-s, --swagger <dir>', 'directory of swagger spec files')
    .option('-o, --output <dir>', 'directory to output service codes')
    .parse(process.argv);

const PROTO_DIR = (program as any).proto === undefined ? undefined : LibPath.normalize((program as any).proto);
const SWAGGER_DIR = (program as any).swagger === undefined ? undefined : LibPath.normalize((program as any).swagger);
const OUTPUT_DIR = (program as any).output === undefined ? undefined : LibPath.normalize((program as any).output);
const METHOD_OPTIONS = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch'];

class GatewayCLI {
    private _protoFiles: Array<ProtoFile> = [];
    private _swaggerList: Array<SwaggerSpec> = [];
    private _protoMsgImportInfos: ProtoMsgImportInfos = {};

    static instance() {
        return new GatewayCLI();
    }

    public async run() {
        debug('GatewayCLI start.');
        await this._validate();
        await this._loadProtos();
        await this._loadSpecs();
        await this._genSpecs();
    }

    private async _validate() {
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
        debug('ServiceCLI load proto files.');

        this._protoFiles = await readProtoList(PROTO_DIR, OUTPUT_DIR);
        if (this._protoFiles.length === 0) {
            throw new Error('no proto files found');
        }
    }

    private async _loadSpecs() {
        debug('GatewayCLI load swagger spec files.');

        this._swaggerList = await readSwaggerList(SWAGGER_DIR, OUTPUT_DIR);
        if (this._swaggerList.length === 0) {
            throw new Error('no valid swagger spec json found');
        }
    }

    private async _genSpecs() {
        debug('GatewayCLI generate router api codes.');


        let protoInfos = [] as Array<ProtoInfo>;
        for (let i = 0; i < this._protoFiles.length; i++) {
            let protoFile = this._protoFiles[i];
            if (!protoFile) {
                continue;
            }
            let protoInfo = {} as ProtoInfo;
            protoInfo.proto = await parseProto(protoFile);
            protoInfo.protoFile = protoFile;
            protoInfos.push(protoInfo);

            let msgImportInfos = await parseMsgNamesFromProto(protoInfo.proto, protoFile, '');
            for (let msgTypeStr in msgImportInfos) {
                this._protoMsgImportInfos[msgTypeStr] = msgImportInfos[msgTypeStr];
            }
        }

        let gatewayInfoList = [] as Array<GatewayInfo>;

        for (let swaggerSpec of this._swaggerList) {
            debug(`GatewayCLI generate swagger spec: ${swaggerSpec.info.title}`);

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
                    if (this._protoMsgImportInfos.hasOwnProperty(responseType)) {
                        let protoMsgImportInfo = this._protoMsgImportInfos[responseType];
                        responseType = protoMsgImportInfo.msgType;
                        protoMsgImportPaths = parseImportPathInfos(
                            protoMsgImportPaths,
                            responseType,
                            Proto.genProtoMsgImportPath(protoMsgImportInfo.protoFile, Proto.genFullOutputServiceDir(protoMsgImportInfo.protoFile)).replace(/\\/g, '/')
                        );
                    }

                    let requestType: string | boolean = false;

                    for (let parameter of methodOperation.parameters) {

                        let type: string;
                        let schema: Array<GatewaySwaggerSchema> = [];

                        switch (parameter.in) {
                            case 'body':
                                let definitionsName = Swagger.getRefName((parameter as BodyParameter).schema.$ref);
                                type = 'object';
                                schema = gatewayDefinitionSchemaMap[definitionsName];

                                if (this._protoMsgImportInfos.hasOwnProperty(definitionsName)) {
                                    let protoMsgImportInfo = this._protoMsgImportInfos[definitionsName];
                                    requestType = protoMsgImportInfo.msgType;
                                    protoMsgImportPaths = parseImportPathInfos(
                                        protoMsgImportPaths,
                                        requestType,
                                        Proto.genProtoMsgImportPath(protoMsgImportInfo.protoFile, Proto.genFullOutputServiceDir(protoMsgImportInfo.protoFile)).replace(/\\/g, '/')
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
                    }
                    
                    gatewayInfoList.push({
                        apiName: ucfirst(method) + methodOperation.operationId,
                        serviceName: methodOperation.tags[0],
                        fileName: lcfirst(method) + methodOperation.operationId,
                        method: method,
                        uri: Swagger.convertSwaggerUriToKoaUri(pathName),
                        parameters: swaggerSchemaList,
                        protoMsgImportPath: protoMsgImportPaths,
                        responseTypeStr: responseType,
                        requestTypeStr: requestType
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
                await mkdir(LibPath.join(OUTPUT_DIR, 'router', gatewayInfo.serviceName));
                let apiContent = TplEngine.render('router/api', {
                    info: gatewayInfo,
                });
                await LibFs.writeFile(LibPath.join(OUTPUT_DIR, 'router', gatewayInfo.serviceName, gatewayInfo.fileName + '.ts'), apiContent);
            }
        }
    }
}

GatewayCLI.instance().run().catch((err: Error) => {
    debug('err: %O', err.message);
});