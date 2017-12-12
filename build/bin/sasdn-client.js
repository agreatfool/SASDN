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
const pkg = require('../../package.json');
program.version(pkg.version)
    .option('-i, --import <items>', 'third party proto import path: e.g path1,path2,path3', function list(val) {
    return val.split(',');
})
    .option('-o, --output <dir>', 'directory to output service codes')
    .option('-e, --exclude <items>', 'files or paths in -p shall be excluded: e.g file1,path1,path2,file2', function list(val) {
    return val.split(',');
})
    .parse(process.argv);
const IMPORTS = program.import === undefined ? [] : program.import;
const OUTPUT_DIR = program.output === undefined ? undefined : LibPath.normalize(program.output);
const EXCLUDES = program.exclude === undefined ? [] : program.exclude;
class ClientCLI {
    constructor() {
        this._protoFiles = [];
    }
    static instance() {
        return new ClientCLI();
    }
    /**
     * Read import proto and generate DependencyClients
     * Only import proto need a client
     */
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('ClientCLI start.');
            yield this._validate();
            yield this._loadProtos();
            yield this._genProtoDependencyClients();
        });
    }
    _validate() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('ClientCLI validate.');
            if (!OUTPUT_DIR) {
                throw new Error('--output is required');
            }
            let outputStat = yield LibFs.stat(OUTPUT_DIR);
            if (!outputStat.isDirectory()) {
                throw new Error('--output is not a directory');
            }
        });
    }
    _loadProtos() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('ClientCLI load proto files.');
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
    _genProtoDependencyClients() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('ClientCLI generate clients.');
            let protoServicesInfos = [];
            let protoMsgImportInfos = {};
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
                Object.assign(protoMsgImportInfos, msgImportInfos);
            }
            yield lib_1.mkdir(LibPath.join(OUTPUT_DIR, 'clients'));
            for (let i = 0; i < parseResults.length; i++) {
                let protoInfo = parseResults[i];
                let services = lib_1.parseServicesFromProto(protoInfo.result);
                if (services.length === 0) {
                    continue;
                }
                /**
                 * Only MS need client & one MS only have one client
                 */
                const service = services[0];
                // handle excludes
                let protoFilePath = LibPath.join(protoInfo.protoFile.protoPath, protoInfo.protoFile.relativePath, protoInfo.protoFile.fileName);
                let shallIgnore = false;
                if (EXCLUDES.length > 0) {
                    EXCLUDES.forEach((exclude) => {
                        if (protoFilePath.indexOf(LibPath.normalize(exclude)) !== -1) {
                            shallIgnore = true;
                        }
                    });
                }
                const protoName = protoInfo.result.package;
                const ucBaseName = lib_1.ucfirst(protoName);
                let protoClientInfo = {
                    protoName: protoName,
                    className: `MS${ucBaseName}Client`,
                    protoFile: protoInfo.protoFile,
                    protoImportPath: lib_1.Proto.genProtoClientImportPath(protoInfo.protoFile).replace(/\\/g, '/'),
                    methodList: {},
                };
                const outputPath = lib_1.Proto.genFullOutputClientPath(protoInfo.protoFile);
                let methodInfos = this._genMethodInfos(protoInfo.protoFile, service, outputPath, protoMsgImportInfos, shallIgnore);
                protoClientInfo.clientName = service.name;
                protoClientInfo.methodList = methodInfos;
                let allMethodImportPath = {};
                for (const method of protoClientInfo.methodList) {
                    for (const key of Object.keys(method.protoMsgImportPath)) {
                        for (const value of method.protoMsgImportPath[key]) {
                            lib_1.addIntoRpcMethodImportPathInfos(allMethodImportPath, value, key);
                        }
                    }
                }
                const importPath = Object.keys(allMethodImportPath)[0];
                protoClientInfo.allMethodImportPath = importPath.replace(/\\/g, '/');
                const moduleSet = new Set(allMethodImportPath[importPath]);
                // check same name
                protoClientInfo.allMethodImportModule = [...moduleSet];
                yield lib_1.mkdir(LibPath.dirname(outputPath));
                template_1.TplEngine.registerHelper('lcfirst', lib_1.lcfirst);
                let content = template_1.TplEngine.render('rpcs/client', Object.assign({}, protoClientInfo));
                yield LibFs.writeFile(outputPath, content);
            }
        });
    }
    _genMethodInfos(protoFile, service, outputPath, importInfos, shallIgnore = false) {
        console.log('ClientCLI generate method infos: %s', service.name);
        let methodKeys = Object.keys(service.methods);
        if (methodKeys.length === 0) {
            return;
        }
        let methodInfos = [];
        for (const methodKey of methodKeys) {
            const method = service.methods[methodKey];
            const methodInfo = lib_1.genRpcMethodInfo(protoFile, method, outputPath, importInfos, 'clients');
            console.log('methodInfo = ', methodInfo);
            methodInfos.push(methodInfo);
        }
        return methodInfos;
    }
}
ClientCLI.instance().run().catch((err) => {
    console.log('err: ', err.message);
});
