import * as LibFs from "mz/fs";
import * as LibFsExtra from "fs-extra";
import * as LibPath from "path";
import * as prompt from "prompt";
import {mkdir} from './lib/lib';

const debug = require('debug')('SASDN:CLI');

interface PromptInput {
    name: string;
    version: string;
    description: string;
}

interface PackageConfigSchema {
    name: string;
    version: string;
    description: string;
}

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
        message: "Wrong project version",
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
], (err, input: PromptInput) => {
    ScaffoldCLI.instance().run(input).catch((err: Error) => {
        debug('err: %O', err.message);
    });
});

class ScaffoldCLI {

    private _input: PromptInput;

    static instance() {
        return new ScaffoldCLI();
    }

    public async run(input: PromptInput) {
        debug('ScaffoldCLI start.');

        this._input = input;

        await this._validate();
        await this._genScaffold();
    }

    private async _validate() {
        debug('ScaffoldCLI validate.');
    }

    private async _genScaffold() {
        debug('ScaffoldCLI _genScaffold.');

        try {
            await this._copyScaffold();
            await this._updateScaffold();
        } catch (e) {
            throw new Error(e);
        }
    }

    private async _copyScaffold() {
        return new Promise(async (resolve, reject) => {
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
                await mkdir(outputDir);
                await LibFsExtra.copy(scaffoldDir, outputDir, (e: Error) => {
                    if (e == null) {
                        debug('ScaffoldCLI _genScaffold finish.');
                        resolve();
                    }
                });
            } catch (e) {
                reject(e.message);
            }
        });
    }

    private async _updateScaffold() {
        const outputDir = LibPath.join(process.cwd(), this._input.name);

        try {
            let packageConfigPath = LibPath.join(outputDir, 'package.json');
            let packageConfig = this._getPackageConfig(packageConfigPath);
            packageConfig.name = this._input.name;
            packageConfig.version = this._input.version;
            packageConfig.description = this._input.description;
            await LibFs.writeFile(packageConfigPath, Buffer.from(JSON.stringify(packageConfig, null, 2)), (err) => {
                if (err) {
                    throw err;
                }
            });

            let spmConfigPath = LibPath.join(outputDir, 'spm.json');
            let spmConfig = this._getPackageConfig(spmConfigPath);
            spmConfig.name = this._input.name;
            spmConfig.version = this._input.version;
            spmConfig.description = this._input.description;
            await LibFs.writeFile(spmConfigPath, Buffer.from(JSON.stringify(spmConfig, null, 2)), (err) => {
                if (err) {
                    throw err;
                }
            });
        } catch (e) {
            throw e;
        }
    }

    private _getPackageConfig(path: string): PackageConfigSchema {
        return JSON.parse(LibFs.readFileSync(path).toString());
    }
}