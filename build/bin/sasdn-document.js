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
                Object.keys(this._serviceInfos).forEach((key) => __awaiter(this, void 0, void 0, function* () {
                    const service = this._serviceInfos[key];
                    const servicePath = LibPath.join(OUTPUT_DIR, 'document', 'api', service.namespace);
                    yield lib_1.mkdir(servicePath);
                    service.methods.forEach((method) => __awaiter(this, void 0, void 0, function* () {
                        yield LibFs.writeFile(LibPath.join(OUTPUT_DIR, servicePath, method.methodName + '.md'), this._genMarkDown());
                    }));
                }));
            }
        });
    }
    _genMarkDown() {
        return `
**简要描述：**

- 游戏用户绑定三方账户接口

**请求URL：**
- \` http://qa-gateway.shinezone.com/v1/game/bindAccount \`

**请求方式：**
- POST

**参数：**

|参数名|必选|类型|说明|
|:----    |:---|:----- |-----   |
|cpId          | 是  |Int32  |发行渠道编号id   |
|appId         |是   |Int32  | 应用编号id    |
|guid           |是   |Uint64 | 游戏角色编号id    |
|accountType   |是   |Int32  | 账户类型    |
|thirdPartyId |是   |String | 第三方平台编号id    |
|accessToken   |是   |String | 登录授权码    |
|extra          |否   |Object | 扩展信息（字段描述详见下表）    |
|timestamp      |是   |Int32  | 时间戳    |
|sign           |是   |String | 秘钥    |

**extra数据格式描述：**

|字段名           |必选|类型|默认值|说明|
|:----            |:---|:----- |:-----   |-----|
|guid             | 否  |Uint64  |0   |游戏角色编号id|
|appId           | 否  |Int32   |0   |应用编号id|
|accountType     | 否  |Int32   |0   |账户类型|
|thirdPartyId   | 否  |String  |空字符串   |第三方平台编号id|
|accessToken     | 否  |String  |空字符串   |登录授权码|


 **参数示例**

\`\`\`
{
  "cpId": 0,
  "appId": 0,
  "guid": "string",
  "accountType": 0,
  "thirdPartyId": "string",
  "accessToken": "string",
  "extra": {
    "guid": "string",
    "appId": 0,
    "accountType": 0,
    "thirdPartyId": "string",
    "accessToken": "string"
  },
  "timestamp": 0,
  "sign": "string"
}
\`\`\`

 **返回示例**

\`\`\` 
{
  "code": 0,
  "message": "string",
  "data": {
    "guid": "string",
    "bind": [
      {
        "guid": "string",
        "appId": 0,
        "account_type": 0,
        "thirdPartyId": "string",
        "thirdPartyNickname": "string",
        "bindTime": 0
      }
    ]
  }
}
\`\`\`

 **返回参数说明**

|参数名|类型|说明|
|:-----  |:-----|-----                           |
|code     |Int32   |接口返回状态  |
|message  |String   |状态描述 |
|data     |Object   |返回数据内容（字段描述详见下表）  |

**data数据格式描述：**

|字段名           |类型|说明|
|:----            |:-----   |-----|
|guid             |String   |游戏角色编号id|
|bind             |Array    |绑定信息数组（字段描述详见下表）|

**bind数据格式描述：**

|字段名           |类型|说明|
|:----                   |:-----   |-----|
|guid                    |String    |游戏角色编号id|
|appId                  |Int32     |应用编号id|
|accountType            |Int32     |账户类型|
|thirdPartyId          |String    |第三方平台编号id|
|thirdPartyNickname    |String    |第三方账户昵称|
|bindTime               |Int32     |绑定时间戳|


 **备注**

- [更多返回错误代码请看首页的错误代码描述](http://172.16.1.26/index.php?s=/1&page_id=2 "更多返回错误代码请看首页的错误代码描述")
    `;
    }
}
DocumentCLI.instance().run().catch((err) => {
    console.log('err: ', err.message);
});
//# sourceMappingURL=sasdn-document.js.map