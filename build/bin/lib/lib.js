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
exports.readProtoList = function (protoDir) {
    return __awaiter(this, void 0, void 0, function* () {
        let files = yield recursive(protoDir, ['.DS_Store']);
        let protoFiles = files.map((file) => {
            let protoFile = {};
            file = file.replace(protoDir, ''); // remove base dir
            protoFile.protoPath = protoDir;
            protoFile.relativePath = LibPath.dirname(file);
            protoFile.fileName = LibPath.basename(file);
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
exports.parseServicesFromProto = function (filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        let content = yield LibFs.readFile(exports.getFullProtoFilePath(filePath));
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
exports.getFullProtoFilePath = function (file) {
    return LibPath.join(file.protoPath, file.relativePath, file.fileName);
};
//# sourceMappingURL=lib.js.map