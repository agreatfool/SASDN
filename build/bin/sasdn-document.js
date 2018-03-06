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
const PROTO_DIR = program.proto === undefined ? undefined : LibPath.normalize(program.proto);
const OUTPUT_DIR = program.output === undefined ? undefined : LibPath.normalize(program.output);
const IMPORTS = program.import === undefined ? [] : program.import;
const GATEWAY = program.gateway !== undefined;
const SERVICE = program.service !== undefined;
const API = program.api != undefined;
const METHOD_OPTIONS = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch'];
class DocumentCLI {
    constructor() {
        this._protoFiles = [];
        this._protoMsgImportInfos = {};
        this._serviceInfos = {};
        this._typeInfos = {};
    }
    static instance() {
        return new DocumentCLI();
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('DocumentCLI start.');
            yield this._validate();
            yield this._loadProtos();
            yield this._genSpecs();
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
            this._protoFiles = yield lib_1.readProtoList(PROTO_DIR, OUTPUT_DIR);
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
    _genSpecs() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('DocumentCLI generate router api codes.');
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
                    if (msgInfo.methods) {
                        this._serviceInfos[msgTypeStr] = msgInfo;
                    }
                    else if (msgInfo.fields) {
                        this._typeInfos[msgTypeStr] = msgInfo;
                    }
                }
            }
            let gatewayInfoList = [];
            // make router dir in OUTPUT_DIR
            yield lib_1.mkdir(LibPath.join(OUTPUT_DIR, 'document'));
            if (GATEWAY) {
            }
            if (SERVICE) {
            }
            if (API) {
            }
        });
    }
    _checkFieldInfo(field) {
        if (field.fieldInfo) {
            const msgTypeStr = field.fieldInfo;
            if (this._protoMsgImportInfos.hasOwnProperty(msgTypeStr)) {
                const nextFields = this._protoMsgImportInfos[msgTypeStr].fields;
                nextFields.forEach((nextField) => {
                    this._checkFieldInfo(nextField);
                });
                field.fieldInfo = nextFields;
            }
        }
    }
    _genFieldInfo(field, space = '', newLine = '') {
        let { fieldName, fieldType, fieldComment, isRepeated, fieldInfo } = field;
        fieldName = isRepeated ? fieldName + 'List' : fieldName;
        if (typeof (fieldComment) === 'string') {
            // Comments is not JSON
            fieldComment = {};
        }
        let extraStr = '';
        const jsonComment = fieldComment;
        if (jsonComment && jsonComment.hasOwnProperty('Joi')) {
            const joiComment = jsonComment['Joi'];
            extraStr += joiComment.required ? '.required()' : '.optional()';
            if (joiComment.defaultValue) {
                const defaultValue = fieldType === 'string' ? `'${joiComment.defaultValue}'` : joiComment.defaultValue;
                extraStr += `.default(${defaultValue})`;
            }
            if (joiComment.valid) {
                const valid = joiComment.valid.map((value) => {
                    return typeof (value) === 'string' ? `'${value}'` : value;
                });
                extraStr += `.valid([${valid.join(', ')}])`;
            }
            if (joiComment.invalid) {
                const invalid = joiComment.invalid.map((value) => {
                    return typeof (value) === 'string' ? `'${value}'` : value;
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
                    return typeof (value) === 'string' ? `'${value}'` : value;
                });
                extraStr += `.truthy([${truthy.join(', ')}])`;
            }
            if (joiComment.falsy) {
                const falsy = joiComment.falsy.map((value) => {
                    return typeof (value) === 'string' ? `'${value}'` : value;
                });
                extraStr += `.falsy([${falsy.join(', ')}])`;
            }
        }
        if (fieldInfo && typeof (fieldInfo) !== 'string') {
            // Means this field is not a base type
            let returnStr = `${space}${fieldName}: ${isRepeated ? 'LibJoi.array().items(' : ''}LibJoi.object().keys({\n`;
            space += newLine ? '' : '        ';
            fieldInfo.forEach((nextField) => {
                returnStr += this._genFieldInfo(nextField, space + '  ', '\n');
            });
            returnStr += `${space}${isRepeated ? ')' : ''}})${extraStr},${newLine}`;
            return returnStr;
        }
        else {
            // protobuffer base type
            return `${space}${fieldName}: ${isRepeated ? 'LibJoi.array().items(' : ''}PbJoi.v${lib_1.ucfirst(fieldType)}.activate()${isRepeated ? ')' : ''}${extraStr},${newLine}`;
        }
    }
    _isNumber(type) {
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
DocumentCLI.instance().run().catch((err) => {
    console.log('err: ', err.message);
});
//# sourceMappingURL=sasdn-document.js.map