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
const LibFsExtra = require("fs-extra");
const LibPath = require("path");
const prompt = require("prompt");
const lib_1 = require("./lib/lib");
const debug = require('debug')('SASDN:CLI');
prompt.start();
prompt.get([
    {
        name: 'name',
        required: true,
        default: 'demo'
    },
    {
        name: 'version',
        required: true,
        default: '0.0.0',
        message: 'Wrong project version',
        conform: (value) => {
            let versions = value.split('.');
            for (let key of versions) {
                if (!(key >= 0)) {
                    return false;
                }
            }
            return true;
        }
    },
    {
        name: 'description',
        required: false,
        default: ''
    }
], (err, input) => {
    ScaffoldCLI.instance().run(input).catch((err) => {
        debug('err: %O', err.message);
    });
});
class ScaffoldCLI {
    static instance() {
        return new ScaffoldCLI();
    }
    run(input) {
        return __awaiter(this, void 0, void 0, function* () {
            debug('ScaffoldCLI start.');
            this._input = input;
            yield this._validate();
            yield this._genScaffold();
        });
    }
    _validate() {
        return __awaiter(this, void 0, void 0, function* () {
            debug('ScaffoldCLI validate.');
        });
    }
    _genScaffold() {
        return __awaiter(this, void 0, void 0, function* () {
            debug('ScaffoldCLI _genScaffold.');
            try {
                yield this._copyScaffold();
                yield this._updateScaffold();
            }
            catch (e) {
                throw new Error(e);
            }
        });
    }
    _copyScaffold() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const scaffoldDir = LibPath.join(__dirname, '..', '..', 'scaffold');
                if (!LibFs.existsSync(scaffoldDir) || !LibFs.statSync(scaffoldDir).isDirectory()) {
                    reject('scaffold dir not found, path:' + scaffoldDir);
                    return;
                }
                const outputDir = LibPath.join(process.cwd(), this._input.name);
                if (LibFs.existsSync(outputDir) && LibFs.statSync(outputDir).isDirectory()) {
                    reject('output dir already exists, path:' + outputDir);
                    return;
                }
                try {
                    yield lib_1.mkdir(outputDir);
                    yield LibFsExtra.copy(scaffoldDir, outputDir, (e) => {
                        if (e == null) {
                            debug('ScaffoldCLI _genScaffold finish.');
                            resolve();
                        }
                    });
                }
                catch (e) {
                    reject(e.message);
                }
            }));
        });
    }
    _updateScaffold() {
        return __awaiter(this, void 0, void 0, function* () {
            const outputDir = LibPath.join(process.cwd(), this._input.name);
            try {
                let packageConfigPath = LibPath.join(outputDir, 'package.json');
                let packageConfig = this._getPackageConfig(packageConfigPath);
                packageConfig.name = this._input.name;
                packageConfig.version = this._input.version;
                packageConfig.description = this._input.description;
                yield LibFs.writeFile(packageConfigPath, Buffer.from(JSON.stringify(packageConfig, null, 2)), (err) => {
                    if (err) {
                        throw err;
                    }
                });
                let spmConfigPath = LibPath.join(outputDir, 'spm.json');
                let spmConfig = this._getPackageConfig(spmConfigPath);
                spmConfig.name = this._input.name;
                spmConfig.version = this._input.version;
                spmConfig.description = this._input.description;
                yield LibFs.writeFile(spmConfigPath, Buffer.from(JSON.stringify(spmConfig, null, 2)), (err) => {
                    if (err) {
                        throw err;
                    }
                });
            }
            catch (e) {
                throw e;
            }
        });
    }
    _getPackageConfig(path) {
        return JSON.parse(LibFs.readFileSync(path).toString());
    }
}
//# sourceMappingURL=sasdn-scaffold.js.map