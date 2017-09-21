import * as LibFs from "mz/fs";

import {TracerOptions} from "./TracerHelper";

export interface ConfigOptions {
    name: string;
    host: string;
    port: number;
    tracer?: boolean | TracerOptions;
}

const defaultConfigs: ConfigOptions = {
    name: "unknown",
    host: "127.0.0.1",
    port: 8080,
    tracer: false
};

export class ConfigHelper {
    private static _instance: ConfigHelper;

    private _initialized: boolean;
    private _configs: ConfigOptions;

    public static instance(): ConfigHelper {
        if (ConfigHelper._instance === undefined) {
            ConfigHelper._instance = new ConfigHelper();
        }
        return ConfigHelper._instance;
    }

    private constructor() {
        this._initialized = false;
    }

    public init(configPath: string) {
        return LibFs.stat(configPath)
            .then((stats) => {
                // validate file is exist
                if (!stats.isFile()) {
                    throw new Error(`[Config] Invalid path, config:${configPath}`);
                }

                this._configs = ConfigHelper.mergerObject(defaultConfigs, require(configPath));
                this._initialized = true;
            });
    }

    public getOption(): ConfigOptions {
        if (!this._initialized) {
            throw new Error('[Config] Config Instance has not initialized!');
        }
        return this._configs;
    }

    public static mergerObject(object: { [key: string]: any }, newObject: { [key: string]: any }): any {
        for (let key in newObject) {
            object[key] = newObject[key];
        }
        return object;
    }
}
