const debug = require('debug')('SASDN:Config');

export class ConnectKey {
  public static Gateway:string = 'GATEWAY';
  public static Order:string = 'ORDER';
  public static Kafkaqueue:string = 'KAFKA';
  public static Zipkin:string = 'ZIPKIN';
}

export class SingleKey {
  public static AllowDomain:string = 'ALLOW_DOMAIN';
  public static CookieDomain:string = 'COOKIE_DOMAIN';
}

export type ConfigKey = ConnectKey | SingleKey;

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

  public async init(): Promise<any> {
    for(const key of Object.keys(ConnectKey)) {
      [`${ConnectKey[key]}`,`${ConnectKey[key]}_HOST`, `${ConnectKey[key]}_PORT`].map(value => {
        const envValue = process.env[value];
        if(!envValue) {
          throw new Error(`[Config] Invalid value, key:${value}`);
        }
        this._configMap[value] = envValue;
      });
    }
    for(const key of Object.keys(SingleKey)) {
      const value = SingleKey[key];
      this._configMap[value] = process.env[value];
    }

    this._initialized = true;

    return Promise.resolve();
  }

  public getConfig(key: ConfigKey): string {
    if (!this._initialized) {
      throw new Error('[Config] Config Instance has not initialized!');
    }
    return this._configMap[key.toString()];
  }

  public getAddress(connName: ConnectKey): string {
    if (!this._initialized) {
      throw new Error('[Config] Config Instance has not initialized!');
    }
    const host = this._configMap[`${connName}_HOST`];
    const port = this._configMap[`${connName}_PORT`] || '';
    const address = host + (port ? `:${port}` : '');
    debug(`get address = ${address}, and conn = ${connName}`);
    return address;
  }

  public getHost(connName: ConnectKey): string {
    if (!this._initialized) {
      throw new Error('[Config] Config Instance has not initialized!');
    }
    const host = this._configMap[`${connName}_HOST`];
    return host;
  }

  public getPort(connName: ConnectKey): number {
    if (!this._initialized) {
      throw new Error('[Config] Config Instance has not initialized!');
    }
    const port = this._configMap[`${connName}_PORT`];
    return parseInt(port);
  }
}
