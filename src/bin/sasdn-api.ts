import * as LibFs from 'mz/fs';
import * as program from 'commander';
import * as LibPath from 'path';
import {
  lcfirst,
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

const pkg = require('../../package.json');

program.version(pkg.version)
  .option('-p, --proto <dir>', 'directory of proto files')
  .option('-i, --import <items>', 'third party proto import path: e.g path1,path2,path3', val => val.split(','))
  .option('-o, --output <dir>', 'directory to output service codes')
  .parse(process.argv);

const PROTO_DIR = (program as any).proto === undefined ? undefined : LibPath.normalize((program as any).proto);
const IMPORTS = (program as any).import === undefined ? [] : (program as any).import;
const OUTPUT_DIR = (program as any).output === undefined ? undefined : LibPath.normalize((program as any).output);

class ApiClientCLI {
  private _selfNamespaceList: string[] = [];
  private _rootProtoFiles: Array<ProtoFile> = [];
  private _protoFiles: Array<ProtoFile> = [];
  private _serviceInfos: ProtoMsgImportInfos = {};
  private _selfServiceInfos: ProtoMsgImportInfos = {};
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
  private _namespaceList: string[];

  static instance() {
    return new ApiClientCLI();
  }

  public async run() {
    console.log('ApiClientCLI start.');
    await this._validate();
    await this._loadProtos();
    await this._genInfos();
    this._filterUselessTypeInfos();
    this._filterUselessNamespaces();
    this._filterUselessService();
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

    this._rootProtoFiles = await readProtoList(PROTO_DIR, OUTPUT_DIR);
    this._selfNamespaceList = this._rootProtoFiles.map(item => item.relativePath);
    this._protoFiles = this._protoFiles.concat(this._rootProtoFiles);
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
    // 生成 namespaceList
    this._namespaceList = [...new Set(Object.keys(this._serviceInfos).map(item => item.split('.')[0]))];
  }

  /**
   * 生成 type 是请求或者响应类型的列表,示例如下:
   * ['gateway.UserGetRequest', 'gateway.UserGetResponse']
   * @returns {Promise<string[]>}
   * @private
   */
  private _genReqOrResTypeList(): string[] {
    const reqOrResTypeList: string[] = [];
    for (let serviceInfoName in this._serviceInfos) {
      const serviceInfo = this._serviceInfos[serviceInfoName];
      for (let method of serviceInfo.methods) {
        reqOrResTypeList.push(method.requestType);
        reqOrResTypeList.push(method.responseType);
      }
    }
    return reqOrResTypeList;
  }

  /**
   * 过滤不必要的类型
   * @returns {Promise<void>}
   * @private
   */
  private _filterUselessTypeInfos() {
    let tempTypeInfos: ProtoMsgImportInfos = {};
    let reqOrResTypeList = this._genReqOrResTypeList();
    for (let typeName in this._typeInfos) {
      const typeInfo: ProtoMsgImportInfo = this._typeInfos[typeName];
      if (this._selfNamespaceList.indexOf(typeInfo.namespace) !== -1 && reqOrResTypeList.indexOf(typeName) !== -1) {
        tempTypeInfos[typeName] = typeInfo;
        this._recurFilterTypeInfo(tempTypeInfos, typeInfo);
      }
    }
    this._typeInfos = tempTypeInfos;
  }

  /**
   * 递归过滤不必要的类型
   * @param {ProtoMsgImportInfos} tempTypeInfos
   * @param {ProtoMsgImportInfo} typeInfo
   * @returns {Promise<void>}
   * @private
   */
  private _recurFilterTypeInfo(tempTypeInfos: ProtoMsgImportInfos, typeInfo: ProtoMsgImportInfo) {
    for (let field of typeInfo.fields) {
      if (!this._protoTsTypeMap[field.fieldType] && !/^(google\.)|(bytes)/.test(field.fieldType)) {
        tempTypeInfos[field.fieldType] = this._typeInfos[field.fieldType];
        this._recurFilterTypeInfo(tempTypeInfos, this._typeInfos[field.fieldType]);
      }
    }
  }

  /**
   * 过滤不必要的 namespace
   * @returns {Promise<void>}
   * @private
   */
  private _filterUselessNamespaces() {
    let tempNamespaceSet: Set<string> = new Set();
    for (let typeName in this._typeInfos) {
      let typeInfo = this._typeInfos[typeName];
      tempNamespaceSet.add(typeInfo.namespace);
    }
    this._namespaceList = [...tempNamespaceSet];
  }

  /**
   * 过滤不必要的 service
   * @returns {Promise<void>}
   * @private
   */
  private _filterUselessService() {
    let tempServiceMap: ProtoMsgImportInfos = {};
    for (let serviceName in this._serviceInfos) {
      let service = this._serviceInfos[serviceName];
      if (this._selfNamespaceList.indexOf(service.namespace) !== -1) {
        tempServiceMap[serviceName] = service;
      }
    }
    this._selfServiceInfos = tempServiceMap;
  }

  private _registerHelpers() {
    TplEngine.registerHelper('lcfirst', lcfirst);

    TplEngine.registerHelper('setVar', (varName: string, varValue: string, options): void => {
      options.data.root[varName] = varValue;
      return;
    });

    TplEngine.registerHelper('uppercaseAndReplaceUnderline', (v: string): string => {
      return v.replace(/(^.)|(?:_(.))/g, (v1, v2, v3) => (v2 || v3).toUpperCase());
    });
  }

  private async _genApiClient() {
    let outputDir = LibPath.join(OUTPUT_DIR, 'api_client');
    await mkdir(outputDir);
    let context = {
      serviceInfos: this._serviceInfos,
      typeInfos: this._typeInfos,
      selfNamespaceList: this._selfNamespaceList,
      protoTsTypeMap: this._protoTsTypeMap,
      namespaceList: this._namespaceList,
      selfServiceInfos: this._selfServiceInfos,
    };
    this._registerHelpers();
    let tsContent: string = TplEngine.render('client/tsApiClient', context);
    await LibFs.writeFile(LibPath.join(outputDir, 'ApiClient.ts'), tsContent);
    let jsContent: string = TplEngine.render('client/jsApiClient', context);
    await LibFs.writeFile(LibPath.join(outputDir, 'ApiClient.js'), jsContent);
  }
}

ApiClientCLI.instance().run().catch((err: Error) => {
  console.log('err: ', err.message);
});
