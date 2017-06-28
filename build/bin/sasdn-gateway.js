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
    .option('-s, --swagger <dir>', 'directory of swagger spec files')
    .option('-o, --output <dir>', 'directory to output service codes')
    .parse(process.argv);
const SWAGGER_DIR = program.swagger === undefined ? undefined : LibPath.normalize(program.swagger);
const OUTPUT_DIR = program.output === undefined ? undefined : LibPath.normalize(program.output);
const METHOD_OPTIONS = ["get", "put", "post", "delete", "options", "head", "patch"];
class GatewayCLI {
    constructor() {
        this._swaggerList = [];
    }
    static instance() {
        return new GatewayCLI();
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            debug('GatewayCLI start.');
            yield this._validate();
            yield this._loadSpecs();
            yield this._genSpecs();
        });
    }
    _validate() {
        return __awaiter(this, void 0, void 0, function* () {
            debug('GatewayCLI validate.');
            if (!SWAGGER_DIR) {
                throw new Error('--swagger is required');
            }
            if (!OUTPUT_DIR) {
                throw new Error('--output is required');
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
    _loadSpecs() {
        return __awaiter(this, void 0, void 0, function* () {
            debug('GatewayCLI load swagger spec files.');
            this._swaggerList = yield lib_1.readSwaggerList(SWAGGER_DIR, OUTPUT_DIR);
            if (this._swaggerList.length === 0) {
                throw new Error('no swagger spec files found');
            }
        });
    }
    _genSpecs() {
        return __awaiter(this, void 0, void 0, function* () {
            debug('GatewayCLI generate router api codes.');
            let gatewayInfoList = [];
            for (let swaggerSpec of this._swaggerList) {
                debug(`GatewayCLI generate swagger spec: ${swaggerSpec.info.title}`);
                // Parse swagger definitions schema to {GatewayParameterList}
                let gatewayDefinitionSchemaMap = {};
                for (let definitionName in swaggerSpec.definitions) {
                    gatewayDefinitionSchemaMap[definitionName] = lib_1.Swagger.parseSwaggerDefinitionMap(swaggerSpec.definitions, definitionName);
                }
                // Parse proto filename
                let protoName = swaggerSpec.info.title.replace('.proto', '');
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
                        // loop method parameters
                        let parameterList = [];
                        for (let parameter of methodOperation.parameters) {
                            let type;
                            let schema = [];
                            switch (parameter.in) {
                                case "body":
                                    type = 'object';
                                    schema = gatewayDefinitionSchemaMap[lib_1.Swagger.getRefName(parameter.schema.$ref)];
                                    break;
                                case "query":
                                case "path":
                                    type = parameter.type;
                                    break;
                                default:
                                    type = 'any'; // headParameter, formDataParameter
                                    break;
                            }
                            let parameterSchema = {
                                name: parameter.name,
                                required: parameter.required,
                                type: type,
                            };
                            if (schema.length > 0) {
                                parameterSchema.schema = schema;
                            }
                            parameterList.push(parameterSchema);
                        }
                        gatewayInfoList.push({
                            operationId: lib_1.ucfirst(method) + methodOperation.operationId,
                            serviceName: methodOperation.tags[0],
                            fileName: lib_1.lcfirst(method) + methodOperation.operationId,
                            method: method,
                            uri: lib_1.Swagger.convertSwaggerUriToKoaUri(pathName),
                            responseTypeStr: lib_1.Swagger.getSwaggerResponseType(methodOperation, protoName),
                            protoMsgImportPath: LibPath.join('..', '..', 'proto', protoName + '_pb').replace(/\\/g, '/'),
                            parameters: parameterList,
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
                // write file {gatewayApiName}.ts in OUTPUT_DIR/router/{gatewayApiService}/
                for (let gatewayInfo of gatewayInfoList) {
                    yield lib_1.mkdir(LibPath.join(OUTPUT_DIR, 'router', gatewayInfo.serviceName));
                    let apiContent = template_1.TplEngine.render('router/api', {
                        info: gatewayInfo,
                    });
                    yield LibFs.writeFile(LibPath.join(OUTPUT_DIR, 'router', gatewayInfo.serviceName, gatewayInfo.fileName + ".ts"), apiContent);
                }
            }
        });
    }
}
GatewayCLI.instance().run().catch((err) => {
    debug('err: %O', err.message);
});
//# sourceMappingURL=sasdn-gateway.js.map