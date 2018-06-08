import memcached = require('memcached');
import { Config, ConfigConst } from './Config';

export interface setDefine {
  key: string;
  value: string;
  expire: number;
}

export class Memcached {
  private static _instance: Memcached;

  private _initialized: boolean;
  private _memcachedUrls: string[];
  private _connections: memcached[];

  private constructor() {
    this._initialized = false;
    this._connections = [];
  }

  public static get instance(): Memcached {
    if (Memcached._instance === undefined) {
      Memcached._instance = new Memcached();
    }

    return Memcached._instance;
  }

  public async initalize(): Promise<void> {
    const memcachedUrlsStr = Config.instance.getConfig(ConfigConst.MEMCACHED_URLS);
    this._memcachedUrls = memcachedUrlsStr.split(',');

    const MEMCACHED_POOL_COUNT = parseInt(process.env.MEMCACHED_POOL_COUNT) || 30;
    for (let i = 0;i < MEMCACHED_POOL_COUNT;i++) {
      this._connections.push(this._createConnection());
    }
  }

  public syncSet(key: string, value: string, lifetime: number): Promise<{ err: any, result: boolean }> {
    return new Promise((resolve, reject) => {
      let conn = this._connections.pop();
      if (!conn) {
        conn = this._createConnection();
      }
      conn.set(key, value, lifetime, (err, result) => {
        this._connections.push(conn);
        if (err) {
          reject(err);
        }
        resolve({ err, result });
      });
    });
  }

  private pureSet(key: string, value: string, lifetime: number, conn: memcached): Promise<boolean> {
    return new Promise((resolve, reject) => {
      conn.set(key, value, lifetime, (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    });
  }

  public syncSetMulti(multiSets: setDefine[]): Promise<boolean[]> {
    return new Promise(async (resolve, reject) => {
      let conn = this._connections.pop();
      if (!conn) {
        conn = this._createConnection();
      }
      let results: boolean[] = [];
      for (let set of multiSets) {
        try {
          let bool = await this.pureSet(set.key, set.value, set.expire, conn);
          results.push(bool);
        } catch (error) {
          this._connections.push(conn);
          reject(error);
        }
      }
      this._connections.push(conn);
      resolve(results);
    });
  }

  public syncAdd(key: string, value: string, lifetime: number): Promise<{ err: any, result: boolean }> {
    return new Promise((resolve, reject) => {
      let conn = this._connections.pop();
      if (!conn) {
        conn = this._createConnection();
      }
      conn.add(key, value, lifetime, (err, result) => {
        this._connections.push(conn);
        if (err) {
          reject(err);
        }
        resolve({ err, result });
      });
    });
  }

  public syncDel(key: string): Promise<{ err: any, result: boolean }> {
    return new Promise((resolve, reject) => {
      let conn = this._connections.pop();
      if (!conn) {
        conn = this._createConnection();
      }
      conn.del(key, (err, result) => {
        this._connections.push(conn);
        if (err) {
          reject(err);
        }
        resolve({ err, result });
      });
    });
  }

  public syncGet(key: string): Promise<{ err: any, result: any }> {
    return new Promise((resolve, reject) => {
      let conn = this._connections.pop();
      if (!conn) {
        conn = this._createConnection();
      }
      conn.get(key, (err, result) => {
        this._connections.push(conn);
        if (err) {
          reject(err);
        }
        resolve({ err, result });
      });
    });
  }

  public syncGetMulti(keys: string[]): Promise<{ err: any, result: { [key: string]: any } }> {
    return new Promise((resolve, reject) => {
      let conn = this._connections.pop();
      if (!conn) {
        conn = this._createConnection();
      }
      conn.getMulti(keys, (err, result) => {
        this._connections.push(conn);
        if (err) {
          reject(err);
        }
        resolve({ err, result });
      });1;
    });
  }

  public async close(): Promise<void> {
    this._connections.map(conn => {
      if (conn) {
        conn.end();
      }
    });
  }

  private _createConnection(): memcached {
    let location: memcached.Location = this._memcachedUrls;
    return new memcached(location);
  }
}
