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
const lib_2 = require("./lib/lib");
const pkg = require('../../package.json');
const debug = require('debug')('SASDN:CLI:Router');
program.version(pkg.version)
    .option('-s, --swagger <dir>', 'directory of swagger spec files')
    .option('-o, --output <dir>', 'directory to output service codes')
    .parse(process.argv);
const SWAGGER_DIR = program.swagger === undefined ? undefined : LibPath.normalize(program.swagger);
const OUTPUT_DIR = program.output === undefined ? undefined : LibPath.normalize(program.output);
class RouterCLI {
    constructor() {
        this._swaggerSpecList = [];
    }
    static instance() {
        return new RouterCLI();
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            debug('RouterCLI start.');
            yield this._validate();
            yield this._loadSpecs();
            yield this._genSpecs();
        });
    }
    _validate() {
        return __awaiter(this, void 0, void 0, function* () {
            debug('RouterCLI validate.');
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
            debug('RouterCLI load swagger spec files.');
            this._swaggerSpecList = yield lib_2.readSwaggerSpecList(SWAGGER_DIR, OUTPUT_DIR);
            if (this._swaggerSpecList.length === 0) {
                throw new Error('no swagger spec files found');
            }
        });
    }
    _genSpecs() {
        return __awaiter(this, void 0, void 0, function* () {
            debug('RouterCLI generate router api codes.');
            let routerApiInfos = [];
            for (let i = 0; i < this._swaggerSpecList.length; i++) {
                let swaggerSpec = this._swaggerSpecList[i];
                debug(`RouterCLI generate swagger spec: ${swaggerSpec.info.title}`);
                let protoName = swaggerSpec.info.title.split('.proto')[0];
                // 处理整个Definition的数据模型
                let definitionsSchema = {};
                for (let definitionName in swaggerSpec.definitions) {
                    definitionsSchema[definitionName] = parseDefinitionsSchema(swaggerSpec.definitions, definitionName);
                }
                // 逐个处理uri的参数与返回结果
                for (let uri in swaggerSpec.paths) {
                    for (let method in swaggerSpec.paths[uri]) {
                        let methodOptions = swaggerSpec.paths[uri][method];
                        let routerApiInfo = {};
                        routerApiInfo.operationId = lib_1.ucfirst(method) + methodOptions.operationId;
                        routerApiInfo.serviceName = methodOptions.tags[0];
                        routerApiInfo.fileName = lib_1.lcfirst(method) + methodOptions.operationId + ".ts";
                        routerApiInfo.method = method;
                        routerApiInfo.uri = uri;
                        routerApiInfo.type = "application/json; charset=utf-8";
                        routerApiInfo.parameters = [];
                        routerApiInfo.protoName = protoName;
                        // 返回结果处理
                        let responseDefinitionName = parseRefs(methodOptions.responses[200].schema.$ref);
                        routerApiInfo.responseTypeStr = responseDefinitionName.replace(protoName, '');
                        // 参数处理
                        for (let parameter of methodOptions.parameters) {
                            let apiParameters = {};
                            apiParameters.name = parameter.name;
                            apiParameters.required = parameter.required == true ? 'required' : 'optional';
                            switch (parameter.in) {
                                case "body":
                                    let requestDefinitionName = parseRefs(parameter.schema.$ref);
                                    apiParameters.type = 'object';
                                    apiParameters.schema = definitionsSchema[requestDefinitionName];
                                    break;
                                case "query":
                                case "path":
                                case "header":
                                    apiParameters.type = parameter.type;
                                    break;
                                default:
                                    apiParameters.type = 'any';
                                    break;
                            }
                            routerApiInfo.parameters.push(apiParameters);
                        }
                        routerApiInfos.push(routerApiInfo);
                    }
                }
                yield lib_1.mkdir(LibPath.join(OUTPUT_DIR, 'router'));
                // write Router Loader
                template_1.TplEngine.registerHelper('lcfirst', lib_1.lcfirst);
                let routerContent = template_1.TplEngine.render('router/router', {
                    apiInfos: routerApiInfos,
                });
                yield LibFs.writeFile(LibPath.join(OUTPUT_DIR, 'router', 'Router.ts'), routerContent);
                // write Router Api
                for (let apiInfo of routerApiInfos) {
                    yield lib_1.mkdir(LibPath.join(OUTPUT_DIR, 'router', apiInfo.serviceName));
                    let apiContent = template_1.TplEngine.render('router/api', {
                        apiInfo: apiInfo,
                    });
                    yield LibFs.writeFile(LibPath.join(OUTPUT_DIR, 'router', apiInfo.serviceName, apiInfo.fileName), apiContent);
                }
            }
        });
    }
}
RouterCLI.instance().run().catch((err) => {
    debug('err: %O', err.message);
});
function parseDefinitionsSchema(definitions, definitionName) {
    let parameterSchemas = [];
    if (definitions.hasOwnProperty(definitionName)) {
        let requiredProperties = definitions[definitionName].required || null;
        let properties = definitions[definitionName].properties;
        // Definition Property 层 name => types
        for (let propertyName in properties) {
            let parameterSchema = {};
            parameterSchema.name = propertyName;
            parameterSchema.required = (requiredProperties !== null && requiredProperties.indexOf(propertyName) >= 0) ? 'required' : 'optional';
            parameterSchema.type = "any";
            if (properties[propertyName].$ref) {
                let definitionName = parseRefs(properties[propertyName].$ref);
                parameterSchema.type = "object";
                parameterSchema.refName = definitionName;
                parameterSchema.schema = parseDefinitionsSchema(definitions, definitionName);
            }
            else if (properties[propertyName].type) {
                parameterSchema.type = parseType(properties[propertyName].type);
                if (properties[propertyName].type == 'array') {
                    if (properties[propertyName].items.hasOwnProperty("$ref")) {
                        let definitionName = parseRefs(properties[propertyName].items["$ref"]);
                        parameterSchema.refName = definitionName + "[]";
                        parameterSchema.schema = parseDefinitionsSchema(definitions, definitionName);
                    }
                    else if (properties[propertyName].items.hasOwnProperty("type")) {
                        parameterSchema.refName = parseType(properties[propertyName].items["type"]) + "[]";
                    }
                }
            }
            parameterSchemas.push(parameterSchema);
        }
    }
    return parameterSchemas;
}
function parseRefs(ref) {
    return ref.replace('#/definitions/', '');
}
function parseType(type) {
    let enumTypes = {
        "integer": "number",
        "number": "number",
        "string": "string",
        "boolean": "boolean",
        "object": "object",
        "array": "array"
    };
    return enumTypes.hasOwnProperty(type) ? enumTypes[type] : "any";
}
//# sourceMappingURL=sasdn-router.js.map