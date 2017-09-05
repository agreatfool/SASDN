"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LibFs = require("mz/fs");
const defaultConfigs = {
    name: "unknown",
    host: "127.0.0.1",
    port: 8080,
    tracer: false
};
class ConfigHandler {
    static instance() {
        if (ConfigHandler._instance === undefined) {
            ConfigHandler._instance = new ConfigHandler();
        }
        return ConfigHandler._instance;
    }
    constructor() {
        this._initialized = false;
    }
    init(configPath) {
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
    getOption() {
        if (!this._initialized) {
            throw new Error('[Config] Config Instance has not initialized!');
        }
        return this._configs;
    }
    static mergerObject(object, newObject) {
        for (let key in newObject) {
            object[key] = newObject[key];
        }
        return object;
    }
}
exports.ConfigHandler = ConfigHandler;
//# sourceMappingURL=ConfigHandler.js.map