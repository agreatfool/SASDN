import * as LibFs from "mz/fs";
import * as program from "commander";
import * as LibPath from "path";
import {
  BodyParameter, FormDataParameter, HeaderParameter, Operation, Parameter, Path, PathParameter, QueryParameter,
  Spec as SwaggerSpec
} from "swagger-schema-official";
import {lcfirst, ucfirst, mkdir, readSwaggerList, GatewayParameterList, Swagger, GatewayParameter} from "./lib/lib";
import {TplEngine} from "./lib/template";

const pkg = require('../../package.json');
const debug = require('debug')('SASDN:CLI:Gateway');

type GatewayInfo = {
  operationId: string;
  serviceName: string;
  fileName: string;
  method: string;
  uri: string;
  parameters: GatewayParameterList;
  protoMsgImportPath: string;
  responseTypeStr: string;
}

type GatewayDefinitionSchemaMap = { [definitionName: string]: GatewayParameterList }

program.version(pkg.version)
  .option('-s, --swagger <dir>', 'directory of swagger spec files')
  .option('-o, --output <dir>', 'directory to output service codes')
  .parse(process.argv);

const SWAGGER_DIR = (program as any).swagger === undefined ? undefined : LibPath.normalize((program as any).swagger);
const OUTPUT_DIR = (program as any).output === undefined ? undefined : LibPath.normalize((program as any).output);
const METHOD_OPTIONS = ["get", "put", "post", "delete", "options", "head", "patch"];

class GatewayCLI {
    private _swaggerList: Array<SwaggerSpec> = [];

    static instance() {
        return new GatewayCLI();
    }

    public async run() {
      debug('GatewayCLI start.');
      await this._validate();
      await this._loadSpecs();
      await this._genSpecs();
    }

    private async _validate() {
        debug('GatewayCLI validate.');

        if (!SWAGGER_DIR) {
            throw new Error('--swagger is required');
        }

        if (!OUTPUT_DIR) {
            throw new Error('--output is required');
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

    private async _loadSpecs() {
        debug('GatewayCLI load swagger spec files.');

        this._swaggerList = await readSwaggerList(SWAGGER_DIR, OUTPUT_DIR);
        if (this._swaggerList.length === 0) {
          throw new Error('no swagger spec files found');
        }
    }

    private async _genSpecs() {
        debug('GatewayCLI generate router api codes.');

        let gatewayInfoList = [] as Array<GatewayInfo>;

        for (let swaggerSpec of this._swaggerList) {
            debug(`GatewayCLI generate swagger spec: ${swaggerSpec.info.title}`);

            // Parse swagger definitions schema to {GatewayParameterList}
            let gatewayDefinitionSchemaMap = {} as GatewayDefinitionSchemaMap;
            for (let definitionName in swaggerSpec.definitions) {
                gatewayDefinitionSchemaMap[definitionName] = Swagger.parseSwaggerDefinitionMap(swaggerSpec.definitions, definitionName);
            }

            // Parse proto filename
            let protoName = swaggerSpec.info.title.replace('.proto', '');

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

                    // loop method parameters
                    let parameterList = [] as GatewayParameterList;
                    for (let parameter of methodOperation.parameters) {

                        let type: string;
                        let schema: GatewayParameterList = [];

                        switch (parameter.in) {
                            case "body":
                                type = 'object';
                                schema = gatewayDefinitionSchemaMap[Swagger.getRefName((parameter as BodyParameter).schema.$ref)];
                                break;
                            case "query":
                            case "path":
                                type = (parameter as QueryParameter | PathParameter ).type;
                                break;
                            default:
                                type = 'any'; // headParameter, formDataParameter
                                break;
                        }

                        let parameterSchema: GatewayParameter = {
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
                        operationId: ucfirst(method) + methodOperation.operationId,
                        serviceName: methodOperation.tags[0],
                        fileName: lcfirst(method) + methodOperation.operationId,
                        method: method,
                        uri: Swagger.convertSwaggerUriToKoaUri(pathName),
                        responseTypeStr: Swagger.getSwaggerResponseType(methodOperation, protoName),
                        protoMsgImportPath: LibPath.join('..', '..', 'proto', protoName + '_pb').replace(/\\/g, '/'),
                        parameters: parameterList,
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

            // write file {gatewayApiName}.ts in OUTPUT_DIR/router/{gatewayApiService}/
            for (let gatewayInfo of gatewayInfoList) {
                await mkdir(LibPath.join(OUTPUT_DIR, 'router', gatewayInfo.serviceName));
                let apiContent = TplEngine.render('router/api', {
                    info: gatewayInfo,
                });
                await LibFs.writeFile(LibPath.join(OUTPUT_DIR, 'router', gatewayInfo.serviceName, gatewayInfo.fileName + ".ts"), apiContent);
            }
        }
    }
}

GatewayCLI.instance().run().catch((err: Error) => {
    debug('err: %O', err.message);
});