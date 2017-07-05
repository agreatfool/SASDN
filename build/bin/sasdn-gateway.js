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
const pkg = require('../../package.json');
const debug = require('debug')('SASDN:CLI:Gateway');
program.version(pkg.version)
    .option('-p, --proto <dir>', 'directory of proto files')
    .option('-s, --swagger <dir>', 'directory of swagger spec files')
    .option('-o, --output <dir>', 'directory to output service codes')
    .parse(process.argv);
const PROTO_DIR = program.proto === undefined ? undefined : LibPath.normalize(program.proto);
const SWAGGER_DIR = program.swagger === undefined ? undefined : LibPath.normalize(program.swagger);
const OUTPUT_DIR = program.output === undefined ? undefined : LibPath.normalize(program.output);
const METHOD_OPTIONS = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch'];
class GatewayCLI {
    constructor() {
        this._protoFiles = [];
        this._swaggerList = [];
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
            for (let i = 0; i < this._protoFiles.length; i++) {
                let protoFile = this._protoFiles[i];
                if (!protoFile) {
                    continue;
                }
                console.log(protoFile);
            }
            // let gatewayInfoList = [] as Array<GatewayInfo>;
            //
            // for (let swaggerSpec of this._swaggerList) {
            //     debug(`GatewayCLI generate swagger spec: ${swaggerSpec.info.title}`);
            //
            //     // Parse swagger definitions schema to ${Array<GatewaySwaggerSchema>}
            //     let gatewayDefinitionSchemaMap = {} as GatewayDefinitionSchemaMap;
            //     for (let definitionName in swaggerSpec.definitions) {
            //         gatewayDefinitionSchemaMap[definitionName] = Swagger.parseSwaggerDefinitionMap(swaggerSpec.definitions, definitionName);
            //     }
            //
            //     // Parse proto filename
            //     //FIXME: this is not "protoName", actually this is namespace, [Big Bug wait for fixed]
            //     let protoName = swaggerSpec.info.title.replace('.proto', '');
            //
            //     // Loop paths uri
            //     for (let pathName in swaggerSpec.paths) {
            //         let swaggerPath = swaggerSpec.paths[pathName] as Path;
            //
            //         // method: GET, PUT, POST, DELETE, OPTIONS, HEAD, PATCH
            //         for (let method in swaggerPath) {
            //             // not a method operation
            //             if (METHOD_OPTIONS.indexOf(method) < 0) {
            //                 continue;
            //             }
            //
            //             // read method operation
            //             let methodOperation = swaggerPath[method] as Operation;
            //             let responseTypeStr = Swagger.getSwaggerResponseType(methodOperation, protoName);
            //             let requestTypeStr = [] as Array<string>;
            //
            //             // loop method parameters
            //             let swaggerSchemaList = [] as Array<GatewaySwaggerSchema>;
            //             for (let parameter of methodOperation.parameters) {
            //
            //                 let type: string;
            //                 let schema: Array<GatewaySwaggerSchema> = [];
            //                 let refName: string;
            //
            //                 switch (parameter.in) {
            //                     case 'body':
            //                         let definitionName = Swagger.getRefName((parameter as BodyParameter).schema.$ref);
            //                         type = 'object';
            //                         schema = gatewayDefinitionSchemaMap[definitionName];
            //                         refName = Swagger.removeProtoName(definitionName, protoName);
            //                         break;
            //                     case 'query':
            //                     case 'path':
            //                         type = (parameter as QueryParameter | PathParameter).type;
            //                         break;
            //                     default:
            //                         type = 'any'; // headParameter, formDataParameter
            //                         break;
            //                 }
            //
            //                 let swaggerSchema: GatewaySwaggerSchema = {
            //                     name: parameter.name,
            //                     required: parameter.required,
            //                     type: type,
            //                 };
            //
            //                 //FIXME: requestType maybe is include from other proto file, this way only include in current proto, need fixed! [Small Bug]
            //                 if (refName) {
            //                     swaggerSchema.refName = refName;
            //                     if (refName != responseTypeStr && requestTypeStr.indexOf(refName) < 0) {
            //                         requestTypeStr.push(refName);
            //                     }
            //                 }
            //
            //                 if (schema.length > 0) {
            //                     swaggerSchema.schema = schema;
            //                 }
            //
            //                 swaggerSchemaList.push(swaggerSchema);
            //             }
            //
            //             gatewayInfoList.push({
            //                 apiName: ucfirst(method) + methodOperation.operationId,
            //                 serviceName: methodOperation.tags[0],
            //                 fileName: lcfirst(method) + methodOperation.operationId,
            //                 method: method,
            //                 uri: Swagger.convertSwaggerUriToKoaUri(pathName),
            //                 protoMsgImportPath: LibPath.join('..', '..', 'proto', protoName + '_pb').replace(/\\/g, '/'),
            //                 parameters: swaggerSchemaList,
            //                 responseTypeStr: responseTypeStr,
            //                 requestTypeStr: requestTypeStr.length > 0 ? requestTypeStr : false,
            //             });
            //         }
            //     }
            //
            //     // make router dir in OUTPUT_DIR
            //     await mkdir(LibPath.join(OUTPUT_DIR, 'router'));
            //
            //     // write file Router.ts in OUTPUT_DIR/router/
            //     TplEngine.registerHelper('lcfirst', lcfirst);
            //     let routerContent = TplEngine.render('router/router', {
            //         infos: gatewayInfoList,
            //     });
            //     await LibFs.writeFile(LibPath.join(OUTPUT_DIR, 'router', 'Router.ts'), routerContent);
            //
            //     // write file ${gatewayApiName}.ts in OUTPUT_DIR/router/${gatewayApiService}/
            //     for (let gatewayInfo of gatewayInfoList) {
            //         await mkdir(LibPath.join(OUTPUT_DIR, 'router', gatewayInfo.serviceName));
            //         let apiContent = TplEngine.render('router/api', {
            //             info: gatewayInfo,
            //         });
            //         await LibFs.writeFile(LibPath.join(OUTPUT_DIR, 'router', gatewayInfo.serviceName, gatewayInfo.fileName + '.ts'), apiContent);
            //     }
            // }
        });
    }
}
GatewayCLI.instance().run().catch((err) => {
    debug('err: %O', err.message);
});
//# sourceMappingURL=sasdn-gateway.js.map