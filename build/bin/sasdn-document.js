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
const PROTO_DIR = program.proto === undefined ? undefined : LibPath.normalize(program.proto);
const OUTPUT_DIR = program.output === undefined ? undefined : LibPath.normalize(program.output);
const IMPORTS = program.import === undefined ? [] : program.import;
const ALL = program.all !== undefined;
const SERVICE = program.service !== undefined || true;
const METHOD = program.method != undefined;
class DocumentCLI {
    constructor() {
        this._rootFiles = [];
        this._protoFiles = [];
        this._serviceInfos = {};
        this._typeInfos = {};
        this._serviceIndex = -1;
        this._methodIndex = -1;
    }
    static instance() {
        return new DocumentCLI();
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('DocumentCLI start.');
            yield this._validate();
            yield this._loadProtos();
            yield this._genDocuments();
        });
    }
    _validate() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('DocumentCLI validate.');
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
            console.log('ServiceCLI load result files.');
            this._rootFiles = yield lib_1.readProtoList(PROTO_DIR, OUTPUT_DIR);
            this._protoFiles = this._protoFiles.concat(this._rootFiles);
            if (IMPORTS.length > 0) {
                for (let i = 0; i < IMPORTS.length; i++) {
                    this._protoFiles = this._protoFiles.concat(yield lib_1.readProtoList(LibPath.normalize(IMPORTS[i]), OUTPUT_DIR));
                }
            }
            if (this._protoFiles.length === 0) {
                throw new Error('no proto files found');
            }
        });
    }
    _genDocuments() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('DocumentCLI generate Documents.');
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
                    else if (msgInfo.fields && msgInfo.fields.length > 0) {
                        this._typeInfos[msgTypeStr] = msgInfo;
                    }
                }
            }
            // make router dir in OUTPUT_DIR
            yield lib_1.mkdir(LibPath.join(OUTPUT_DIR, 'document'));
            if (ALL) {
                this._serviceIndex = 0;
                yield LibFs.writeFile(LibPath.join(OUTPUT_DIR, 'document', 'Document.md'), this._genAll());
            }
            if (SERVICE) {
                this._serviceIndex = -1;
                const servicePath = LibPath.join(OUTPUT_DIR, 'document');
                yield lib_1.mkdir(servicePath);
                Object.keys(this._serviceInfos).forEach((key) => __awaiter(this, void 0, void 0, function* () {
                    const service = this._serviceInfos[key];
                    if (this._rootFiles.indexOf(service.protoFile) >= 0) {
                        this._methodIndex = 0;
                        yield LibFs.writeFile(LibPath.join(servicePath, service.msgType.replace(/^\S+\./, '') + '.md'), this._genService(service));
                    }
                }));
            }
            if (METHOD) {
                this._methodIndex = -1;
                const routerPath = LibPath.join(OUTPUT_DIR, 'document', 'method');
                yield lib_1.mkdir(routerPath);
                Object.keys(this._serviceInfos).forEach((key) => __awaiter(this, void 0, void 0, function* () {
                    const service = this._serviceInfos[key];
                    if (this._rootFiles.indexOf(service.protoFile) >= 0) {
                        service.methods.forEach((method) => __awaiter(this, void 0, void 0, function* () {
                            yield LibFs.writeFile(LibPath.join(routerPath, method.methodName + '.md'), this._genMethod(method));
                        }));
                    }
                }));
            }
        });
    }
    _genAll() {
        let services = '';
        Object.keys(this._serviceInfos).forEach((key) => __awaiter(this, void 0, void 0, function* () {
            const service = this._serviceInfos[key];
            if (this._rootFiles.indexOf(service.protoFile) >= 0) {
                services += this._genService(service);
            }
        }));
        return `
# 接口文档

[TOC]

${services}
    `;
    }
    _genService(service) {
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
    _genMethod(method) {
        let methodDesc = '无';
        if (method.methodComment && typeof method.methodComment === 'object' && method.methodComment.hasOwnProperty('Desc')) {
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
- \` ${method.googleHttpOption ? method.googleHttpOption.router : lib_1.lcfirst(method.methodName)} \`

**请求方式：**
- ${method.googleHttpOption ? method.googleHttpOption.method : 'RPC'}

${this._genParam(method.requestType, 1 /* REQUEST */, method.googleHttpOption !== undefined)}

${this._genParam(method.responseType, 2 /* RESPONSE */, method.googleHttpOption !== undefined)}

    `;
    }
    _genParam(paramName, paramType, isGateway) {
        let childData = [];
        let param = '';
        let paramObject = {};
        let childContent = '';
        const isRequestStyle = (paramType === 1 /* REQUEST */) && isGateway;
        if (this._typeInfos.hasOwnProperty(paramName)) {
            const msgImport = this._typeInfos[paramName];
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
**${paramType === 1 /* REQUEST */ ? '请求' : '返回'}结构说明：**

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
    _genChildContent(type, paramType, isGateway) {
        if (!this._typeInfos.hasOwnProperty(type)) {
            return '';
        }
        const msgImport = this._typeInfos[type];
        let param = '';
        msgImport.fields.forEach((field) => {
            param += this._genFieldInfo(field, paramType);
        });
        const isRequestStyle = (paramType === 1 /* REQUEST */) && isGateway;
        let content = `
**${type.replace(/^\S+\./, '')}数据格式描述：**

${isRequestStyle ? '|字段名|必选|类型|默认值|说明|' : '|字段名|类型|说明|'}
${isRequestStyle ? '|:---|:---|:---|:---|:---|' : '|:---|:---|:---|'}
${param}
    `;
        return content;
    }
    _genFieldInfo(field, paramType, childData, paramObject) {
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
            fieldType = `Map< ${lib_1.ucfirst(keyType)}, T >`;
        }
        if (field.fieldInfo && typeof field.fieldInfo === 'string') {
            const msgTypeStr = field.fieldInfo;
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
        }
        else {
            // |参数名|必选|类型|默认值|说明|
            if (field.fieldComment && typeof field.fieldComment === 'object') {
                if (field.fieldComment.hasOwnProperty('Joi')) {
                    const joiComment = field.fieldComment['Joi'];
                    isRequired = joiComment.required;
                    defaultValue = joiComment.defaultValue || defaultValue;
                }
                if (field.fieldComment.hasOwnProperty('Desc')) {
                    desc = field.fieldComment['Desc'];
                }
            }
            if (paramObject) {
                paramObject[field.fieldName] = isRepeated ? [defaultValue] : defaultValue;
            }
            fieldType = fieldType ? fieldType.replace('T', lib_1.ucfirst(field.fieldType)) : lib_1.ucfirst(field.fieldType);
        }
        if (paramType === 1 /* REQUEST */) {
            defaultValue = typeof defaultValue === 'string' ? `"${defaultValue}"` : defaultValue;
            return `|${field.fieldName}|${isRequired ? '必传' : '可传'}|${fieldType}|${isRequired ? '---' : defaultValue}|${desc}|\n`;
        }
        else {
            return `|${field.fieldName}|${fieldType}|${desc}|\n`;
        }
    }
}
DocumentCLI.instance().run().catch((err) => {
    console.log('err: ', err.message);
});
//# sourceMappingURL=sasdn-document.js.map