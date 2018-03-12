import * as LibFs from 'mz/fs';
import * as program from 'commander';
import * as LibPath from 'path';
import {
  FieldInfo, lcfirst, MethodInfo, mkdir, parseMsgNamesFromProto, parseProto, ProtoFile,
  ProtoMsgImportInfo, ProtoMsgImportInfos, ProtoParseResult, readProtoList, ucfirst
} from './lib/lib';

const pkg = require('../../package.json');

interface JoiComment {
  required: boolean;
  defaultValue?: any;
  valid?: Array<any>;
  invalid?: Array<any>;
  min?: number;
  max?: number;
  greater?: number;
  less?: number;
  interger?: any;
  positive?: any;
  regex?: string;
  truthy?: Array<any>;
  falsy?: Array<any>;
  allow?: Array<any>;
  email?: boolean;
  uri?: Array<any>;
}

const TypeDefaultValue = {
  double: 0,
  float: 0,
  int32: 0,
  int64: 0,
  uint32: 0,
  uint64: 0,
  sint32: 0,
  sint64: 0,
  fixed32: 0,
  fixed64: 0,
  sfixed32: 0,
  sfixed64: 0,
  string: '',
  bool: false
};

const enum ParamType {
  REQUEST = 1,
  RESPONSE
}

program.version(pkg.version)
  .option('-p, --proto <dir>', 'directory of proto files')
  .option('-o, --output <dir>', 'directory to output document')
  .option('-i, --import <items>', 'third party proto import path: e.g path1,path2,path3', function list(val) {
    return val.split(',');
  })
  .option('-a, --all', 'generate all service in one md document')
  .option('-s, --service', 'generate a md document for each service')
  .option('-m, --method', 'generate a md document for each method')
  .parse(process.argv);

const PROTO_DIR = (program as any).proto === undefined ? undefined : LibPath.normalize((program as any).proto);
const OUTPUT_DIR = (program as any).output === undefined ? undefined : LibPath.normalize((program as any).output);
const IMPORTS = (program as any).import === undefined ? [] : (program as any).import;
const ALL = (program as any).all !== undefined;
const SERVICE = (program as any).service !== undefined;
const METHOD = (program as any).method != undefined;

class DocumentCLI {
  private _rootFiles: Array<ProtoFile> = [];
  private _protoFiles: Array<ProtoFile> = [];
  private _serviceInfos: ProtoMsgImportInfos = {};
  private _typeInfos: ProtoMsgImportInfos = {};
  private _serviceIndex = -1;
  private _methodIndex = -1;

  static instance() {
    return new DocumentCLI();
  }

  public async run() {
    console.log('DocumentCLI start.');
    await this._validate();
    await this._loadProtos();
    await this._genDocuments();
  }

  private async _validate() {
    console.log('DocumentCLI validate.');

    if (!PROTO_DIR) {
      throw new Error('--proto is required');
    }
    if (!OUTPUT_DIR) {
      throw new Error('--output is required');
    }
    let protoStat = await LibFs.stat(PROTO_DIR);
    if (!protoStat.isDirectory()) {
      throw new Error('--proto is not a directory');
    }
    let outputStat = await LibFs.stat(OUTPUT_DIR);
    if (!outputStat.isDirectory()) {
      throw new Error('--output is not a directory');
    }
  }

  private async _loadProtos() {
    console.log('ServiceCLI load result files.');

    this._rootFiles = await readProtoList(PROTO_DIR, OUTPUT_DIR);
    this._protoFiles = this._protoFiles.concat(this._rootFiles);
    if (IMPORTS.length > 0) {
      for (let i = 0; i < IMPORTS.length; i++) {
        this._protoFiles = this._protoFiles.concat(await readProtoList(LibPath.normalize(IMPORTS[i]), OUTPUT_DIR));
      }
    }
    if (this._protoFiles.length === 0) {
      throw new Error('no proto files found');
    }
  }

  private async _genDocuments() {
    console.log('DocumentCLI generate Documents.');

    // 从 proto 文件中解析出 ProtobufIParserResult 数据
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

      let msgImportInfos = parseMsgNamesFromProto(parseResult.result, protoFile);
      for (let msgTypeStr in msgImportInfos) {
        const msgInfo: ProtoMsgImportInfo = msgImportInfos[msgTypeStr];
        if (msgInfo.methods && msgInfo.methods.length > 0) {
          this._serviceInfos[msgTypeStr] = msgInfo;
        } else if (msgInfo.fields && msgInfo.fields.length > 0) {
          this._typeInfos[msgTypeStr] = msgInfo;
        }
      }
    }

    // make router dir in OUTPUT_DIR
    await mkdir(LibPath.join(OUTPUT_DIR, 'document'));

    if (ALL) {
      this._serviceIndex = 0;
      await LibFs.writeFile(LibPath.join(OUTPUT_DIR, 'document', 'Api-Gateway.md'), this._genGateway());
    }

    if (SERVICE) {
      this._methodIndex = 0;
      this._serviceIndex = -1;
      Object.keys(this._serviceInfos).forEach(async (key) => {
        const service = this._serviceInfos[key] as ProtoMsgImportInfo;
        if (this._rootFiles.indexOf(service.protoFile) >= 0) {
          const servicePath = LibPath.join(OUTPUT_DIR, 'document', service.namespace, 'service');
          await mkdir(servicePath);
          await LibFs.writeFile(LibPath.join(OUTPUT_DIR, servicePath,
            service.msgType.replace(/^\S+\./, '') + '.md'), this._genService(service));
        }
      });
    }

    if (METHOD) {
      this._methodIndex = -1;
      Object.keys(this._serviceInfos).forEach(async (key) => {
        const service = this._serviceInfos[key] as ProtoMsgImportInfo;
        if (this._rootFiles.indexOf(service.protoFile) >= 0) {
          service.methods.forEach(async (method) => {
            const routerPath = LibPath.join(OUTPUT_DIR, 'document', service.namespace, 'method');
            await mkdir(routerPath);
            await LibFs.writeFile(LibPath.join(OUTPUT_DIR, routerPath, method.methodName + '.md'), this._genMethod(method));
          });
        }
      });
    }
  }

  private _genGateway(): string {
    let services = '';
    Object.keys(this._serviceInfos).forEach(async (key) => {
      const service = this._serviceInfos[key] as ProtoMsgImportInfo;
      if (this._rootFiles.indexOf(service.protoFile) >= 0) {
        services += this._genService(service);
      }
    });
    return `
# Api-Gateway 接口文档

[TOC]

${services}
    `;
  }

  private _genService(service: ProtoMsgImportInfo): string {
    let methods = '';
    service.methods.forEach((method) => {
      methods += this._genMethod(method);
    });
    if (this._serviceIndex !== -1) {
      this._serviceIndex++;
    }
    return `
## ${this._serviceIndex !== -1 ? this._serviceIndex + '. ' : ''}${service.msgType.replace(/^\S+\./, '')}
    
${this._serviceIndex === -1 ? '[TOC]' : ''}
    
${methods}
    `;
  }

  private _genMethod(method: MethodInfo): string {
    let methodDesc = '无';
    if (method.methodComment && typeof(method.methodComment) === 'object' && method.methodComment.hasOwnProperty('Desc')) {
      methodDesc = method.methodComment['Desc'];
    }
    if (this._methodIndex !== -1) {
      this._methodIndex++;
    }
    return `
### ${this._methodIndex === -1 ? '' : this._methodIndex + '. '}${method.methodName}   
   
**简要描述：**

- ${methodDesc}

**请求${method.googleHttpOption ? 'Router:' : '方法:'}**
- \` ${method.googleHttpOption ? method.googleHttpOption.router : lcfirst(method.methodName)} \`

**请求方式：**
- ${method.googleHttpOption ? method.googleHttpOption.method : 'RPC'}

${this._genParam(method.requestType, ParamType.REQUEST, method.googleHttpOption !== undefined)}

${this._genParam(method.responseType, ParamType.RESPONSE, method.googleHttpOption !== undefined)}

    `;
  }

  private _genParam(paramName: string, paramType: ParamType, isGateway: boolean): string {
    let childData: Array<string> = [];
    let param = '';
    let paramObject = {};
    let childContent = '';
    const isRequestStyle: boolean = (paramType === ParamType.REQUEST) && isGateway;
    if (this._typeInfos.hasOwnProperty(paramName)) {
      const msgImport = this._typeInfos[paramName] as ProtoMsgImportInfo;
      msgImport.fields.forEach((field) => {
        param += this._genFieldInfo(field, paramType, childData, paramObject);
      });
    }
    if (childData.length > 0) {
      childData = childData.reverse();
      childData.forEach((childType) => {
        childContent += this._genChildContent(childType, paramType, isGateway);
      });
    }
    let content = `
**${paramType === ParamType.REQUEST ? '请求' : '返回'}参数说明：**

${isRequestStyle ? '|参数名|必选|类型|默认值|说明|' : '|参数名|类型|说明|'}
${isRequestStyle ? '|:---|:---|:---|:---|:---|' : '|:---|:---|:---|'}
${param}
${childContent}

**参数示例**

\`\`\`
${JSON.stringify(paramObject, null, 2)}
\`\`\`
    `;
    return content;
  }

  private _genChildContent(type: string, paramType: ParamType, isGateway: boolean): string {
    if (!this._typeInfos.hasOwnProperty(type)) {
      return '';
    }
    const msgImport = this._typeInfos[type] as ProtoMsgImportInfo;
    let param = '';
    msgImport.fields.forEach((field) => {
      param += this._genFieldInfo(field, paramType);
    });
    const isRequestStyle: boolean = (paramType === ParamType.REQUEST) && isGateway;
    let content = `
**${type.replace(/^\S+\./, '')}数据格式描述：**

${isRequestStyle ? '|字段名|必选|类型|默认值|说明|' : '|字段名|类型|说明|'}
${isRequestStyle ? '|:---|:---|:---|:---|:---|' : '|:---|:---|:---|'}
${param}
    `;
    return content;
  }

  private _genFieldInfo(field: FieldInfo, paramType: ParamType, childData?: Array<string>, paramObject?: object): string {
    let isRequired = false;
    let isRepeated = field.isRepeated;
    let keyType = field.keyType;
    let defaultValue = TypeDefaultValue[field.fieldType];
    defaultValue = defaultValue === undefined ? '{}' : defaultValue;
    let desc = '无';
    let fieldType;
    if (isRepeated) {
      fieldType = 'Array< T >';
    }
    if (keyType) {
      fieldType = `Map< ${ucfirst(keyType)}, T >`;
    }
    if (field.fieldInfo && typeof(field.fieldInfo) === 'string') {
      const msgTypeStr = field.fieldInfo as string;
      if (this._typeInfos.hasOwnProperty(msgTypeStr)) {
        const nextFields = this._typeInfos[msgTypeStr].fields;
        let childParamObject = {};
        nextFields.forEach((nextField) => {
          this._genFieldInfo(nextField, paramType, childData, childParamObject);
        });
        if (childData) {
          childData.push(msgTypeStr);
        }
        if (paramObject) {
          paramObject[field.fieldName] = isRepeated ? [childParamObject] : childParamObject;
        }
        const objectType = `${field.fieldType.replace(/^\S+\./, '')}`;
        fieldType = fieldType ? fieldType.replace('T', objectType) : objectType;
      }
    } else {
      // |参数名|必选|类型|默认值|说明|
      if (field.fieldComment && typeof(field.fieldComment) === 'object') {
        if (field.fieldComment.hasOwnProperty('Joi')) {
          const joiComment = field.fieldComment['Joi'] as JoiComment;
          isRequired = joiComment.required;
          defaultValue = joiComment.defaultValue || defaultValue;
        }
        if (field.fieldComment.hasOwnProperty('Desc')) {
          desc = field.fieldComment['Desc'] as string;
        }
      }
      if (paramObject) {
        paramObject[field.fieldName] = isRepeated ? [defaultValue] : defaultValue;
      }
      fieldType = fieldType ? fieldType.replace('T', ucfirst(field.fieldType)) : ucfirst(field.fieldType);
    }
    if (paramType === ParamType.REQUEST) {
      defaultValue = typeof(defaultValue) === 'string' ? `"${defaultValue}"` : defaultValue;
      return `|${field.fieldName}|${isRequired ? '必传' : '可传'}|${fieldType}|${isRequired ? '---' : defaultValue}|${desc}|\n`;
    } else {
      return `|${field.fieldName}|${fieldType}|${desc}|\n`;
    }
  }
}

DocumentCLI.instance().run().catch((err: Error) => {
  console.log('err: ', err.message);
});