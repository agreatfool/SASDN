import * as LibFs from 'mz/fs';
import * as program from 'commander';
import * as LibPath from 'path';
import {
  addIntoRpcMethodImportPathInfos, FieldInfo, GatewaySwaggerSchema, lcfirst, mkdir, parseMsgNamesFromProto,
  parseProto, Proto, ProtoFile, ProtoMsgImportInfo, ProtoMsgImportInfos, ProtoParseResult, readProtoList,
  readSwaggerList,
  RpcMethodImportPathInfos, Swagger, ucfirst
} from './lib/lib';
import { TplEngine } from './lib/template';

const pkg = require('../../package.json');

interface GatewayInfo {
  apiName: string;
  serviceName: string;
  fileName: string;
  packageName: string;
  method: string;
  uri: string;
  protoMsgImportPath: RpcMethodImportPathInfos;
  funcParamsStr: string;
  aggParamsStr: string;
  requiredParamsStr: string;
  requestTypeStr: string;
  requestParameters: Array<GatewaySwaggerSchema>;
  requestFields: Array<string>;
  responseTypeStr: string;
  responseParameters: Array<GatewaySwaggerSchema>;
  injectedCode: string;
}

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
}

interface GatewayDefinitionSchemaMap {
  [definitionName: string]: Array<GatewaySwaggerSchema>;
}

program.version(pkg.version)
  .option('-p, --proto <dir>', 'directory of proto files')
  .option('-o, --output <dir>', 'directory to output document')
  .option('-i, --import <items>', 'third party proto import path: e.g path1,path2,path3', function list(val) {
    return val.split(',');
  })
  .option('-g, --gateway', 'generate a md document for gateway')
  .option('-s, --service', 'generate a md document for each service')
  .option('-a, --api', 'generate a md document for each api')
  .parse(process.argv);

const PROTO_DIR = (program as any).proto === undefined ? undefined : LibPath.normalize((program as any).proto);
const OUTPUT_DIR = (program as any).output === undefined ? undefined : LibPath.normalize((program as any).output);
const IMPORTS = (program as any).import === undefined ? [] : (program as any).import;
const GATEWAY = (program as any).gateway !== undefined;
const SERVICE = (program as any).service !== undefined;
const API = (program as any).api != undefined;
const METHOD_OPTIONS = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch'];

class DocumentCLI {
  private _protoFiles: Array<ProtoFile> = [];
  private _protoMsgImportInfos: ProtoMsgImportInfos = {};
  private _serviceInfos: ProtoMsgImportInfos = {};
  private _typeInfos: ProtoMsgImportInfos = {};

  static instance() {
    return new DocumentCLI();
  }

  public async run() {
    console.log('DocumentCLI start.');
    await this._validate();
    await this._loadProtos();
    await this._genSpecs();
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

  private async _genSpecs() {
    console.log('DocumentCLI generate router api codes.');

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
        if (msgInfo.methods) {
          this._serviceInfos[msgTypeStr] = msgInfo;
        } else if (msgInfo.fields) {
          this._typeInfos[msgTypeStr] = msgInfo;
        }
      }
    }

    let gatewayInfoList = [] as Array<GatewayInfo>;

    // make router dir in OUTPUT_DIR
    await mkdir(LibPath.join(OUTPUT_DIR, 'router'));

    if (GATEWAY) {

    }

    if (SERVICE) {

    }

    if (API) {
      
    }
  }

  private _checkFieldInfo(field: FieldInfo): void {
    if (field.fieldInfo) {
      const msgTypeStr = field.fieldInfo as string;
      if (this._protoMsgImportInfos.hasOwnProperty(msgTypeStr)) {
        const nextFields = this._protoMsgImportInfos[msgTypeStr].fields;
        nextFields.forEach((nextField) => {
          this._checkFieldInfo(nextField);
        });
        field.fieldInfo = nextFields;
      }
    }
  }

  private _genFieldInfo(field: FieldInfo, space: string = '', newLine: string = ''): string {
    let { fieldName, fieldType, fieldComment, isRepeated, fieldInfo } = field;
    fieldName = isRepeated ? fieldName + 'List' : fieldName;
    if (typeof(fieldComment) === 'string') {
      // Comments is not JSON
      fieldComment = {};
    }
    let extraStr: string = '';
    const jsonComment = fieldComment as object;
    if (jsonComment && jsonComment.hasOwnProperty('Joi')) {
      const joiComment = jsonComment['Joi'] as JoiComment;
      extraStr += joiComment.required ? '.required()' : '.optional()';
      if (joiComment.defaultValue) {
        const defaultValue = fieldType === 'string' ? `'${joiComment.defaultValue}'` : joiComment.defaultValue;
        extraStr += `.default(${defaultValue})`;
      }
      if (joiComment.valid) {
        const valid = joiComment.valid.map((value) => {
          return typeof(value) === 'string' ? `'${value}'` : value;
        });
        extraStr += `.valid([${valid.join(', ')}])`;
      }
      if (joiComment.invalid) {
        const invalid = joiComment.invalid.map((value) => {
          return typeof(value) === 'string' ? `'${value}'` : value;
        });
        extraStr += `.invalid([${invalid.join(', ')}])`;
      }
      extraStr += joiComment.interger && this._isNumber(fieldType) ? '.interger()' : '';
      extraStr += joiComment.positive && this._isNumber(fieldType) ? '.positive()' : '';
      extraStr += joiComment.greater && this._isNumber(fieldType) ? `.greater(${joiComment.greater})` : '';
      extraStr += joiComment.less && this._isNumber(fieldType) ? `.less(${joiComment.less})` : '';
      extraStr += joiComment.max && (this._isNumber(fieldType) || fieldType === 'string') ? `.max(${joiComment.max})` : '';
      extraStr += joiComment.min && (this._isNumber(fieldType) || fieldType === 'string') ? `.min(${joiComment.min})` : '';
      extraStr += joiComment.regex && fieldType === 'string' ? `.regex(${joiComment.regex})` : '';
      if (joiComment.truthy) {
        const truthy = joiComment.truthy.map((value) => {
          return typeof(value) === 'string' ? `'${value}'` : value;
        });
        extraStr += `.truthy([${truthy.join(', ')}])`;
      }
      if (joiComment.falsy) {
        const falsy = joiComment.falsy.map((value) => {
          return typeof(value) === 'string' ? `'${value}'` : value;
        });
        extraStr += `.falsy([${falsy.join(', ')}])`;
      }
    }
    if (fieldInfo && typeof(fieldInfo) !== 'string') {
      // Means this field is not a base type
      let returnStr = `${space}${fieldName}: ${isRepeated ? 'LibJoi.array().items(' : ''}LibJoi.object().keys({\n`;
      space += newLine ? '' : '        ';
      fieldInfo.forEach((nextField) => {
        returnStr += this._genFieldInfo(nextField, space + '  ', '\n');
      });
      returnStr += `${space}${isRepeated ? ')' : ''}})${extraStr},${newLine}`;
      return returnStr;
    } else {
      // protobuffer base type
      return `${space}${fieldName}: ${isRepeated ? 'LibJoi.array().items(' : ''}PbJoi.v${ucfirst(fieldType)}.activate()${isRepeated ? ')' : ''}${extraStr},${newLine}`;
    }
  }

  private _isNumber(type: string): boolean {
    return [
      'double',
      'float',
      'int32',
      'int64',
      'uint32',
      'uint64',
      'sint32',
      'sint64',
      'fixed32',
      'fixed64',
      'sfixed32',
      'sfixed64',
    ].indexOf(type) >= 0;
  }
}

DocumentCLI.instance().run().catch((err: Error) => {
  console.log('err: ', err.message);
});