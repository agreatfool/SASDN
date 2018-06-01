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
const debug_1 = require("debug");
const pp1 = debug_1.default('pp1');
const pkg = require('../../package.json');
program.version(pkg.version)
    .option('-p, --proto <dir>', 'directory of proto files')
    .option('-i, --import <items>', 'third party proto import path: e.g path1,path2,path3', val => val.split(','))
    .option('-o, --output <dir>', 'directory to output service codes')
    .parse(process.argv);
const PROTO_DIR = program.proto === undefined ? undefined : LibPath.normalize(program.proto);
const IMPORTS = program.import === undefined ? [] : program.import;
const OUTPUT_DIR = program.output === undefined ? undefined : LibPath.normalize(program.output);
class ApiClientCLI {
    constructor() {
        this._selfNamespaceList = [];
        this._rootProtoFiles = [];
        this._protoFiles = [];
        this._serviceInfos = {};
        this._selfServiceInfos = {};
        this._typeInfos = {};
        this._protoTsTypeMap = {
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
    }
    static instance() {
        return new ApiClientCLI();
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('ApiClientCLI start.');
            yield this._validate();
            yield this._loadProtos();
            yield this._genInfos();
            yield this._addAttriToInfos();
            yield this._filterUselessTypeInfos();
            yield this._filterUselessNamespaces();
            yield this._filterUselessService();
            yield this._genApiClient();
        });
    }
    _validate() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('ApiClientCLI validate.');
            if (!PROTO_DIR) {
                throw new Error('--proto is required');
            }
            if (!OUTPUT_DIR) {
                throw new Error('--output is required');
            }
            let protoStat = yield LibFs.stat(PROTO_DIR);
            if (!protoStat.isDirectory()) {
                throw new Error('--proto is not a directory');
            }
            let outputStat = yield LibFs.stat(OUTPUT_DIR);
            if (!outputStat.isDirectory()) {
                throw new Error('--output is not a directory');
            }
        });
    }
    _loadProtos() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('ApiClientCLI load proto files.');
            this._rootProtoFiles = yield lib_1.readProtoList(PROTO_DIR, OUTPUT_DIR);
            this._selfNamespaceList = this._rootProtoFiles.map(item => item.relativePath);
            this._protoFiles = this._protoFiles.concat(this._rootProtoFiles);
            for (let i = 0; i < IMPORTS.length; i++) {
                this._protoFiles = this._protoFiles.concat(yield lib_1.readProtoList(LibPath.normalize(IMPORTS[i]), OUTPUT_DIR));
            }
            if (this._protoFiles.length === 0) {
                throw new Error('no proto files found');
            }
        });
    }
    _genInfos() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('ApiClientCLI generate service info and type info.');
            // 从 proto 文件中解析出 ProtobufIParserResult 数据
            let parseResults = [];
            for (let i = 0; i < this._protoFiles.length; i++) {
                let protoFile = this._protoFiles[i];
                if (!protoFile) {
                    continue;
                }
                let parseResult = {};
                parseResult.result = yield lib_1.parseProto(protoFile);
                parseResult.protoFile = protoFile;
                parseResults.push(parseResult);
                let msgImportInfos = lib_1.parseMsgNamesFromProto(parseResult.result, protoFile);
                for (let msgTypeStr in msgImportInfos) {
                    const msgInfo = msgImportInfos[msgTypeStr];
                    if (msgInfo.methods && msgInfo.methods.length > 0) {
                        this._serviceInfos[msgTypeStr] = msgInfo;
                    }
                    else {
                        this._typeInfos[msgTypeStr] = msgInfo;
                    }
                }
            }
            // 生成 namespaceList
            this._namespaceList = [...new Set(Object.keys(this._serviceInfos).map(item => item.split('.')[0]))];
        });
    }
    _addAttriToInfos() {
        return __awaiter(this, void 0, void 0, function* () {
            for (let serviceInfoName in this._serviceInfos) {
                const serviceInfo = this._serviceInfos[serviceInfoName];
                for (let method of serviceInfo.methods) {
                    this._typeInfos[method.requestType].isReq = true;
                    this._typeInfos[method.responseType].isRes = true;
                }
            }
        });
    }
    /**
     * 过滤不必要的类型
     * @returns {Promise<void>}
     * @private
     */
    _filterUselessTypeInfos() {
        return __awaiter(this, void 0, void 0, function* () {
            let tempTypeInfos = {};
            for (let typeName in this._typeInfos) {
                const typeInfo = this._typeInfos[typeName];
                if (this._selfNamespaceList.indexOf(typeInfo.namespace) !== -1 && (typeInfo.isReq || typeInfo.isRes)) {
                    tempTypeInfos[typeName] = typeInfo;
                    yield this._recurFilterTypeInfo(tempTypeInfos, typeInfo);
                }
            }
            this._typeInfos = tempTypeInfos;
        });
    }
    /**
     * 递归过滤不必要的类型
     * @param {ProtoMsgImportInfos} tempTypeInfos
     * @param {ProtoMsgImportInfo} typeInfo
     * @returns {Promise<void>}
     * @private
     */
    _recurFilterTypeInfo(tempTypeInfos, typeInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let field of typeInfo.fields) {
                if (!this._protoTsTypeMap[field.fieldType] && !/^(google\.)|(bytes)/.test(field.fieldType)) {
                    tempTypeInfos[field.fieldType] = this._typeInfos[field.fieldType];
                    this._recurFilterTypeInfo(tempTypeInfos, this._typeInfos[field.fieldType]);
                }
            }
        });
    }
    /**
     * 过滤不必要的 namespace
     * @returns {Promise<void>}
     * @private
     */
    _filterUselessNamespaces() {
        return __awaiter(this, void 0, void 0, function* () {
            let tempNamespaceSet = new Set();
            for (let typeName in this._typeInfos) {
                let typeInfo = this._typeInfos[typeName];
                tempNamespaceSet.add(typeInfo.namespace);
            }
            this._namespaceList = [...tempNamespaceSet];
        });
    }
    /**
     * 过滤不必要的 service
     * @returns {Promise<void>}
     * @private
     */
    _filterUselessService() {
        return __awaiter(this, void 0, void 0, function* () {
            let tempServiceMap = {};
            for (let serviceName in this._serviceInfos) {
                let service = this._serviceInfos[serviceName];
                if (this._selfNamespaceList.indexOf(service.namespace) !== -1) {
                    tempServiceMap[serviceName] = service;
                }
            }
            this._selfServiceInfos = tempServiceMap;
        });
    }
    _genApiClient() {
        return __awaiter(this, void 0, void 0, function* () {
            let outputDir = LibPath.join(OUTPUT_DIR, 'api_client');
            yield lib_1.mkdir(outputDir);
            let content = template_1.TplEngine.render('client/apiClient', {
                serviceInfos: this._serviceInfos,
                typeInfos: this._typeInfos,
                selfNamespaceList: this._selfNamespaceList,
                protoTsTypeMap: this._protoTsTypeMap,
                namespaceList: this._namespaceList,
                selfServiceInfos: this._selfServiceInfos,
            });
            yield LibFs.writeFile(LibPath.join(outputDir, 'ApiClient.ts'), content);
        });
    }
}
ApiClientCLI.instance().run().catch((err) => {
    console.log('err: ', err.message);
});
