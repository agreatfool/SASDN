import * as LibFs from 'mz/fs';
import * as program from 'commander';
import * as LibPath from 'path';
import {
  mkdir,
  parseMsgNamesFromProto,
  parseProto,
  ProtoFile,
  ProtoMsgImportInfo,
  ProtoMsgImportInfos,
  ProtoParseResult,
  readProtoList,
} from './lib/lib';
import { TplEngine } from './lib/template';
import debug from 'debug';

const pp1 = debug('pp1');
const pkg = require('../../package.json');

program.version(pkg.version)
  .option('-p, --proto <dir>', 'directory of proto files')
  .option('-i, --import <items>', 'third party proto import path: e.g path1,path2,path3', val => val.split(','))
  .option('-o, --output <dir>', 'directory to output service codes')
  .option('-g, --gateway <gateway>', 'gateway to generate.')
  .parse(process.argv);

const PROTO_DIR = (program as any).proto === undefined ? undefined : LibPath.normalize((program as any).proto);
const IMPORTS = (program as any).import === undefined ? [] : (program as any).import;
const OUTPUT_DIR = (program as any).output === undefined ? undefined : LibPath.normalize((program as any).output);
const GATEWAY_NAME = (program as any).gateway;

class ApiClientCLI {
  private _selfNamespace: string = GATEWAY_NAME;
  private _protoFiles: Array<ProtoFile> = [];
  private _serviceInfos: ProtoMsgImportInfos = {};
  private _typeInfos: ProtoMsgImportInfos = {};
  private _protoTsTypeMap = {
    double: 'number',
    float: 'number',
    int32: 'number',
    int64: 'number',
    uint32: 'number',
    uint64: 'number',
    sint32: 'number',
    sint64: 'number',
    fixed32: 'number',
    fixed64: 'number',
    sfixed32: 'number',
    sfixed64: 'number',
    string: 'string',
    bool: 'boolean',
  };

  static instance() {
    return new ApiClientCLI();
  }

  public async run() {
    pp1('this._selfNamespace: ', this._selfNamespace);
    console.log('ApiClientCLI start.');
    await this._validate();
    await this._loadProtos();
    await this._genInfos();
    // await this._addAttriToInfos();
    await this._filterUselessTypeInfos();
    await this._genApiClient();
  }

  private async _validate() {
    console.log('ApiClientCLI validate.');
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
    console.log('ApiClientCLI load proto files.');

    const selfProtoFile: ProtoFile = (await readProtoList(PROTO_DIR, OUTPUT_DIR))[0];
    this._protoFiles.push(selfProtoFile);
    for (let i = 0; i < IMPORTS.length; i++) {
      this._protoFiles = this._protoFiles.concat(await readProtoList(LibPath.normalize(IMPORTS[i]), OUTPUT_DIR));
    }
    if (this._protoFiles.length === 0) {
      throw new Error('no proto files found');
    }
  }

  private async _genInfos() {
    console.log('ApiClientCLI generate service info and type info.');

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
        } else {
          this._typeInfos[msgTypeStr] = msgInfo;
        }
      }
    }
  }

  private async _addAttriToInfos() {
    for (let serviceInfoName in this._serviceInfos) {
      const serviceInfo = this._serviceInfos[serviceInfoName];
      for (let method of serviceInfo.methods) {
        this._typeInfos[method.requestType].isReq = true;
        this._typeInfos[method.responseType].isRes = true;
      }
    }
  }

  /**
   * 过滤不必要的类型
   * @returns {Promise<void>}
   * @private
   */
  private async _filterUselessTypeInfos() {
    let a = Object.keys(this._serviceInfos);
    let b = a.filter(i => /^gateway/.test(i));
    pp1(b);
    let tempTypeInfos: ProtoMsgImportInfos = {};
    for (let typeName in this._typeInfos) {
      const typeInfo: ProtoMsgImportInfo = this._typeInfos[typeName];
      if (typeInfo.namespace === this._selfNamespace && (typeInfo.isReq || typeInfo.isRes)) {
        tempTypeInfos[typeName] = typeInfo;
      }
      await this._recurFilterTypeInfo(tempTypeInfos, typeInfo);
    }
    this._typeInfos = tempTypeInfos;

    // pp1(Object.keys(tempTypeInfos));
  }

  /**
   * 递归过滤不必要的类型
   * @param {ProtoMsgImportInfos} tempTypeInfos
   * @param {ProtoMsgImportInfo} typeInfo
   * @returns {Promise<void>}
   * @private
   */
  private async _recurFilterTypeInfo(tempTypeInfos: ProtoMsgImportInfos, typeInfo: ProtoMsgImportInfo) {
    for (let field of typeInfo.fields) {
      if (!this._protoTsTypeMap[field.fieldType] && !/^(google\.)|(bytes)/.test(field.fieldType)) {
        tempTypeInfos[field.fieldType] = this._typeInfos[field.fieldType];
        this._recurFilterTypeInfo(tempTypeInfos, this._typeInfos[field.fieldType]);
      }
    }
  }

  private async _genApiClient() {
    let outputDir = LibPath.join(OUTPUT_DIR, 'api_client');
    await mkdir(outputDir);
    let namespaceList: string[] = [...new Set(Object.keys(this._serviceInfos).map(item => item.split('.')[0]))];
    let content: string = TplEngine.render('client/apiClient', {
      serviceInfos: this._serviceInfos,
      typeInfos: this._typeInfos,
      selfNamespace: this._selfNamespace,
      protoTsTypeMap: this._protoTsTypeMap,
      namespaceList: namespaceList,
    });
    await LibFs.writeFile(LibPath.join(outputDir, 'ApiClient.ts'), content);
  }
}

ApiClientCLI.instance().run().catch((err: Error) => {
  console.log('err: ', err.message);
});
