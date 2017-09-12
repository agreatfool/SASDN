import * as LibFs from "mz/fs";

export interface ConfigOptions {
    name: string;
    host: string;
    port: number;
    tracer?: boolean | TracerOptions;
}

export interface TracerOptions {
    host: string;
    port: number;
}

const defaultConfigs: ConfigOptions = {
    name: "unknown",
    host: "127.0.0.1",
    port: 8080,
    tracer: false
};

export class ConfigHandler {
    private static _instance: ConfigHandler;

    private _initialized: boolean;
    private _configs: ConfigOptions;

    public static instance(): ConfigHandler {
        if (ConfigHandler._instance === undefined) {
            ConfigHandler._instance = new ConfigHandler();
        }
        return ConfigHandler._instance;
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

                this._configs = ConfigHandler.mergerObject(defaultConfigs, require(configPath));
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
