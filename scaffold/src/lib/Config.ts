export class ConfigConst {
  public static CONNECT_GATEWAY: string = 'GATEWAY';
  public static CONNECT_ORDER: string = 'MS_ORDER';
  public static CONNECT_KAFKAQUEUE: string = 'MS_KAFKA';
  public static CONNECT_ZIPKIN: string = 'ZIPKIN';

  public static ALLOW_DOMAIN: string = 'ALLOW_DOMAIN';
  public static COOKIE_DOMAIN: string = 'COOKIE_DOMAIN';
  public static MEMCACHED_URLS: string = 'MEMCACHED_URLS';
}

const debug = require('debug')('SASDN:DEMO');

export class Config {
  private static _instance: Config;

  private _initialized: boolean;
  private _configMap: { [key: string]: string } = {};

  public static get instance(): Config {
    if (Config._instance === undefined) {
      Config._instance = new Config();
    }
    return Config._instance;
  }

  private constructor() {
    this._initialized = false;
  }

  public async initalize(): Promise<any> {
    for (const key of Object.keys(ConfigConst)) {
      if (key.indexOf('CONNECT') >= 0) {
        [`${ConfigConst[key]}`, `${ConfigConst[key]}_HOST`, `${ConfigConst[key]}_PORT`].map(realKey => {
          this._readEnv(realKey);
        });
      } else {
        const realKey = ConfigConst[key];
        this._readEnv(realKey);
      }
    }

    this._initialized = true;

    return Promise.resolve();
  }

  private _readEnv(key: string) {
    const envValue = process.env[key];
    if (!envValue) {
      throw new Error(`[Config] Invalid value, key:${key}`);
    }
    this._configMap[key] = envValue;
  }

  public getConfig(key: ConfigConst): string {
    if (!this._initialized) {
      throw new Error('[Config] Config Instance has not been initialized!');
    }
    return this._configMap[key.toString()];
  }

  public getAddress(connName: ConfigConst): string {
    if (!this._initialized) {
      throw new Error('[Config] Config Instance has not been initialized!');
    }
    const host = this._configMap[`${connName}_HOST`];
    const port = this._configMap[`${connName}_PORT`] || '';
    const address = host + (port ? `:${port}` : '');
    debug(`[getAddress] = ${address}, and conn = ${connName}`);
    return address;
  }

  public getHost(connName: ConfigConst): string {
    if (!this._initialized) {
      throw new Error('[Config] Config Instance has not been initialized!');
    }
    const host = this._configMap[`${connName}_HOST`];
    return host;
  }

  public getPort(connName: ConfigConst): number {
    if (!this._initialized) {
      throw new Error('[Config] Config Instance has not been initialized!');
    }
    const port = this._configMap[`${connName}_PORT`];
    return parseInt(port);
  }
}
