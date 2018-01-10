import * as LibFs from 'mz/fs';
const debug = require('debug')('SASDN:Config');

export const enum ConfigKey {
  Gateway = 'GATEWAY',
  Order = "ORDER",
  Zipkin = "ZIPKIN",
  AllowDomain = 'ALLOWDOMAIN',
  CookieDomain = "COOKIEDOMAIN"
}

export class ConfigHelper {
  private static _instance: ConfigHelper;

  private _initialized: boolean;
  private _configMap: { [key: string]: string } = {};

  public static get instance(): ConfigHelper {
    if (ConfigHelper._instance === undefined) {
      ConfigHelper._instance = new ConfigHelper();
    }
    return ConfigHelper._instance;
  }

  private constructor() {
    this._initialized = false;
  }

  public async init(configPath: string): Promise<any> {
    let stats = await LibFs.stat(configPath);

    // validate file is exist
    if (!stats.isFile()) {
      throw new Error(`[Config] Invalid path, config:${configPath}`);
    }

    const configJson = require(configPath);
    if (configJson) {
      for (const key of Object.keys(configJson)) {
        const value = configJson[key] || process.env[key];
        if(!value) {
          throw new Error(`[Config] Invalid value, key:${key}`);
        }
        this._configMap[key] = value;
      }
    }

    this._initialized = true;

    return Promise.resolve();
  }

  public getConfig(key: string): any {
    if(!this._initialized) {
      throw new Error('[Config] Config Instance has not initialized!');
    }
    return this._configMap[key];
  }

  public getAddress(connName: ConfigKey | string): string {
    if(!this._initialized) {
      throw new Error('[Config] Config Instance has not initialized!');
    }
    const host = this._configMap[`${connName}_HOST`];
    const port = this._configMap[`${connName}_PORT`] || '';
    const address = host + (port ? `:${port}` : '');
    debug(`get address = ${address}, and conn = ${connName}`);
    return address;
  }

  public getHost(connName: ConfigKey | string): string {
    if(!this._initialized) {
      throw new Error('[Config] Config Instance has not initialized!');
    }
    const host = this._configMap[`${connName}_HOST`];
    return host;
  }

  public getPort(connName: ConfigKey | string): number {
    if(!this._initialized) {
      throw new Error('[Config] Config Instance has not initialized!');
    }
    const port = this._configMap[`${connName}_PORT`];
    return parseInt(port);
  }
}
