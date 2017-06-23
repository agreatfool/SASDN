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
const LibPath = require("path");
const LibFs = require("mz/fs");
const recursive = require("recursive-readdir");
const protobuf = require("protobufjs");
const protobufjs_1 = require("protobufjs");
const bluebird = require("bluebird");
const LibMkdirP = require("mkdirp");
const mkdirp = bluebird.promisify(LibMkdirP);
exports.readProtoList = function (protoDir, outputDir, excludes) {
    return __awaiter(this, void 0, void 0, function* () {
        let files = yield recursive(protoDir, ['.DS_Store', function ignoreFunc(file, stats) {
                let shallIgnore = false;
                if (!excludes || excludes.length === 0) {
                    return shallIgnore;
                }
                excludes.forEach((exclude) => {
                    if (file.indexOf(exclude) !== -1) {
                        shallIgnore = true;
                    }
                });
                return shallIgnore;
            }]);
        let protoFiles = files.map((file) => {
            let protoFile = {};
            file = file.replace(protoDir, ''); // remove base dir
            protoFile.protoPath = protoDir;
            protoFile.outputPath = outputDir;
            protoFile.relativePath = LibPath.dirname(file);
            protoFile.fileName = LibPath.basename(file);
            protoFile.filePath = file;
            protoFile.msgNamespace = Proto.filePathToPseudoNamespace(protoFile.fileName);
            protoFile.svcNamespace = Proto.filePathToServiceNamespace(protoFile.fileName);
            if (protoFile.fileName.match(/.+\.proto/) !== null) {
                return protoFile;
            }
            else {
                return undefined;
            }
        }).filter((value) => {
            return value !== undefined;
        });
        return Promise.resolve(protoFiles);
    });
};
exports.readSwaggerSpecList = function (swaggerDir, outputDir, excludes) {
    return __awaiter(this, void 0, void 0, function* () {
        let files = yield recursive(swaggerDir, ['.DS_Store', function ignoreFunc(file, stats) {
                let shallIgnore = false;
                if (!excludes || excludes.length === 0) {
                    return shallIgnore;
                }
                excludes.forEach((exclude) => {
                    if (file.indexOf(exclude) !== -1) {
                        shallIgnore = true;
                    }
                });
                return shallIgnore;
            }]);
        let swaggerSpecList = files.map((file) => {
            file = file.replace(swaggerDir, ''); // remove base dir
            if (LibPath.basename(file).match(/.+\.json/) !== null) {
                let filePath = LibPath.join(swaggerDir, LibPath.dirname(file), LibPath.basename(file));
                try {
                    return JSON.parse(LibFs.readFileSync(filePath).toString());
                }
                catch (e) {
                    return undefined;
                }
            }
            else {
                return undefined;
            }
        }).filter((value) => {
            return value !== undefined;
        });
        return Promise.resolve(swaggerSpecList);
    });
};
exports.parseServicesFromProto = function (protoFile) {
    return __awaiter(this, void 0, void 0, function* () {
        let content = yield LibFs.readFile(Proto.genFullProtoFilePath(protoFile));
        let proto = protobuf.parse(content.toString());
        let pkgRoot = proto.root.lookup(proto.package);
        let services = [];
        let nestedKeys = Object.keys(pkgRoot.nested);
        nestedKeys.forEach((nestedKey) => {
            let nestedInstance = pkgRoot.nested[nestedKey];
            if (!(nestedInstance instanceof protobufjs_1.Service)) {
                return;
            }
            services.push(nestedInstance);
        });
        return Promise.resolve(services);
    });
};
exports.mkdir = function (path) {
    return __awaiter(this, void 0, void 0, function* () {
        return mkdirp(path);
    });
};
exports.lcfirst = function (str) {
    return str.charAt(0).toLowerCase() + str.slice(1);
};
exports.ucfirst = function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
var Proto;
(function (Proto) {
    /**
     * dummy/your.proto => ../
     * dummy/and/dummy/your.proto => ../../../
     * @param {string} filePath
     * @returns {string}
     */
    function getPathToRoot(filePath) {
        const depth = filePath.split("/").length;
        return depth === 1 ? "./" : new Array(depth).join("../");
    }
    Proto.getPathToRoot = getPathToRoot;
    /**
     * dummy/your.proto => dummy_your_pb
     * @param {string} filePath
     * @returns {string}
     */
    Proto.filePathToPseudoNamespace = function (filePath) {
        return filePath.replace(".proto", "").replace(/\//g, "_").replace(/\./g, "_").replace(/-/g, "_") + "_pb";
    };
    /**
     * dummy/your.proto => dummy_your_grpc_pb
     * @param {string} filePath
     * @returns {string}
     */
    function filePathToServiceNamespace(filePath) {
        return filePath.replace(".proto", "").replace(/\//g, "_").replace(/\./g, "_").replace(/-/g, "_") + "_grpc_pb";
    }
    Proto.filePathToServiceNamespace = filePathToServiceNamespace;
    /**
     * Generate service proto js file (e.g *_grpc_pb.js) import path.
     * Source code is "register.ts", service proto js import path is relative to it.
     * @param {ProtoFile} protoFile
     * @returns {string}
     */
    Proto.genProtoServiceImportPath = function (protoFile) {
        return LibPath.join('..', 'proto', protoFile.relativePath, protoFile.svcNamespace);
    };
    /**
     * Generate origin protobuf definition (e.g *.proto) full file path.
     * @param {ProtoFile} protoFile
     * @returns {string}
     */
    Proto.genFullProtoFilePath = function (protoFile) {
        return LibPath.join(protoFile.protoPath, protoFile.relativePath, protoFile.fileName);
    };
    /**
     * Generate message proto js file (e.g *_pb.js) import path.
     * Source code path is generated with {@link genFullOutputServicePath},
     * message proto js import path is relative to it.
     * @param {ProtoFile} protoFile
     * @param {string} serviceFilePath
     * @returns {string}
     */
    Proto.genProtoMsgImportPath = function (protoFile, serviceFilePath) {
        return LibPath.join(getPathToRoot(serviceFilePath.substr(serviceFilePath.indexOf('services'))), 'proto', protoFile.relativePath, protoFile.msgNamespace);
    };
    /**
     * Generate full service stub code output path.
     * @param {ProtoFile} protoFile
     * @param {Service} service
     * @param {Method} method
     * @returns {string}
     */
    Proto.genFullOutputServicePath = function (protoFile, service, method) {
        return LibPath.join(protoFile.outputPath, 'services', protoFile.relativePath, protoFile.svcNamespace, service.name, exports.lcfirst(method.name) + '.ts');
    };
})(Proto = exports.Proto || (exports.Proto = {}));
//# sourceMappingURL=lib.js.map