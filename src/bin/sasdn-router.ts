import * as LibFs from "mz/fs";
import * as program from "commander";
import * as LibPath from "path";
import {
  lcfirst,
  ucfirst,
  mkdir
} from "./lib/lib";
import {TplEngine} from "./lib/template";
import {
  BodyParameter, HeaderParameter, Parameter, PathParameter, QueryParameter, Schema,
  Spec as SwaggerSpec
} from "swagger-schema-official";

import {
    readSwaggerSpecList,
} from "./lib/lib";

const pkg = require('../../package.json');
const debug = require('debug')('SASDN:CLI:Router');

interface RouterApiInfo {
  operationId: string;  // UpdateUser
  serviceName: string;  // UserApiServer
  fileName: string;     // post-UpdateUser
  method: string;       // post
  uri: string;          // /v1/updateUser
  parameters: ParameterSchemas;
  protoMsgImportPath: string,
  responseTypeStr: string
}

interface ParameterSchema {
  name: string,
  type: string,           // string, number, array, object, ANY INTERFACE
  required: string,       // required, optional
  refName?: string,       // 提供给interface使用
  schema?: ParameterSchemas,
  uri?: string[],
}

type ParameterSchemas = ParameterSchema[]

interface DefinitionSchemas {
  [definitionName: string]: ParameterSchemas;
}

program.version(pkg.version)
  .option('-s, --swagger <dir>', 'directory of swagger spec files')
  .option('-o, --output <dir>', 'directory to output service codes')
  .parse(process.argv);

const SWAGGER_DIR = (program as any).swagger === undefined ? undefined : LibPath.normalize((program as any).swagger);
const OUTPUT_DIR = (program as any).output === undefined ? undefined : LibPath.normalize((program as any).output);

class RouterCLI {
    private _swaggerSpecList: Array<SwaggerSpec> = [];

    static instance() {
        return new RouterCLI();
    }

    public async run() {
      debug('RouterCLI start.');
      await this._validate();
      await this._loadSpecs();
      await this._genSpecs();
    }

    private async _validate() {
        debug('RouterCLI validate.');

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
        debug('RouterCLI load swagger spec files.');

        this._swaggerSpecList = await readSwaggerSpecList(SWAGGER_DIR, OUTPUT_DIR);
        if (this._swaggerSpecList.length === 0) {
          throw new Error('no swagger spec files found');
        }
    }

    private async _genSpecs() {
      debug('RouterCLI generate router api codes.');

      let routerApiInfos = [] as Array<RouterApiInfo>;

      for (let i = 0; i < this._swaggerSpecList.length; i++) {
        let swaggerSpec = this._swaggerSpecList[i];
        debug(`RouterCLI generate swagger spec: ${swaggerSpec.info.title}`);

        let protoName = swaggerSpec.info.title.split('.proto')[0];

        // 处理整个Definition的数据模型
        let definitionsSchema = {} as DefinitionSchemas;
        for (let definitionName in swaggerSpec.definitions) {
          definitionsSchema[definitionName] = parseDefinitionsSchema(swaggerSpec.definitions, definitionName);
        }

        await mkdir(LibPath.join(OUTPUT_DIR, 'router'));

        // 逐个处理uri的参数与返回结果
        for (let uri in swaggerSpec.paths) {
          for (let method in swaggerSpec.paths[uri]) {
            let methodOptions = swaggerSpec.paths[uri][method];
            let routerApiInfo = {} as RouterApiInfo;
            routerApiInfo.operationId = ucfirst(method) + methodOptions.operationId;
            routerApiInfo.serviceName = methodOptions.tags[0];
            routerApiInfo.fileName = lcfirst(method) + methodOptions.operationId + ".ts";
            routerApiInfo.method = method;
            routerApiInfo.uri = uri;
            routerApiInfo.parameters = [];
            routerApiInfo.protoMsgImportPath = LibPath.join('..', '..', 'proto', protoName + '_pb').replace(/\\/g, '/');

            // 返回结果处理
            let responseDefinitionName = parseRefs(methodOptions.responses[200].schemaDefObj.$ref);
            routerApiInfo.responseTypeStr = responseDefinitionName.replace(protoName, '');

            // 参数处理
            for (let parameter of methodOptions.parameters) {
              let apiParameters = {} as ParameterSchema;

              apiParameters.name = (parameter as Parameter).name;
              apiParameters.required = (parameter as Parameter).required == true ? 'required' : 'optional';

              switch ((parameter as Parameter).in) {
                case "body":
                  let requestDefinitionName = parseRefs((parameter as BodyParameter).schema.$ref);
                  apiParameters.type = 'object';
                  apiParameters.schema = definitionsSchema[requestDefinitionName];
                  break;
                case "query":
                case "path":
                case "header":
                  apiParameters.type = (parameter as QueryParameter | PathParameter | HeaderParameter).type;
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

        // write Router Loader
        TplEngine.registerHelper('lcfirst', lcfirst);
        let routerContent = TplEngine.render('router/router', {
          apiInfos: routerApiInfos,
        });
        await LibFs.writeFile(LibPath.join(OUTPUT_DIR, 'router', 'Router.ts'), routerContent);

        // write Router Api
        for (let apiInfo of routerApiInfos) {
          await mkdir(LibPath.join(OUTPUT_DIR, 'router', apiInfo.serviceName));

          let apiContent = TplEngine.render('router/api', {
            apiInfo: apiInfo,
          });

          await LibFs.writeFile(LibPath.join(OUTPUT_DIR, 'router', apiInfo.serviceName, apiInfo.fileName), apiContent);
        }

      }
    }
}

RouterCLI.instance().run().catch((err: Error) => {
    debug('err: %O', err.message);
});

function parseDefinitionsSchema(definitions: {[definitionsName: string]: Schema }, definitionName: string): ParameterSchemas {
  let parameterSchemas = [] as ParameterSchemas;

  if (definitions.hasOwnProperty(definitionName)) {

    let requiredProperties = definitions[definitionName].required || null;
    let properties = definitions[definitionName].properties;

    // Definition Property 层 name => types
    for (let propertyName in properties) {

      let parameterSchema = {} as ParameterSchema;
      parameterSchema.name = propertyName;
      parameterSchema.required = (requiredProperties !== null && requiredProperties.indexOf(propertyName) >= 0) ? 'required' : 'optional';
      parameterSchema.type = "any";

      if (properties[propertyName].$ref) {
        let definitionName = parseRefs(properties[propertyName].$ref);
        parameterSchema.type = "object";
        parameterSchema.refName = definitionName;
        parameterSchema.schema = parseDefinitionsSchema(definitions, definitionName);
      } else if (properties[propertyName].type) {
        parameterSchema.type = parseType(properties[propertyName].type);
        if (properties[propertyName].type == 'array') {
          if (properties[propertyName].items.hasOwnProperty("$ref")) {
            let definitionName = parseRefs(properties[propertyName].items["$ref"]);
            parameterSchema.refName = definitionName + "[]";
            parameterSchema.schema = parseDefinitionsSchema(definitions, definitionName);
          } else if (properties[propertyName].items.hasOwnProperty("type")) {
            parameterSchema.refName = parseType(properties[propertyName].items["type"]) + "[]";
          }
        }
      }
      parameterSchemas.push(parameterSchema);
    }
  }

  return parameterSchemas
}

function parseRefs(ref: string): string {
  return ref.replace('#/definitions/', '')
}

function parseType(type: string): string {
  let enumTypes = {
    "integer": "number",
    "number": "number",
    "string": "string",
    "boolean": "boolean",
    "object": "object",
    "array": "array"
  };

  return enumTypes.hasOwnProperty(type) ? enumTypes[type] : "any"
}