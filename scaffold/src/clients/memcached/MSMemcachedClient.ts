import * as grpc from 'grpc';
import { GatewayContext, RpcContext } from "sasdn";
import { Config, ConfigConst } from '../../lib/Config';
import { GrpcImpl } from 'sasdn-zipkin';

import {
  MemcachedServiceClient,
} from "../../proto/memcached/memcached_grpc_pb";
import {
  SetRequest,
  BoolResponse,
  SetMultiRequest,
  BoolsResponse,
  AddRequest,
  DelRequest,
  GetRequest,
  DataResponse,
  GetMultiRequest,
  DatasResponse,
} from "../../proto/memcached/memcached_pb";

export default class MSMemcachedClient {
  public client: MemcachedServiceClient;

  constructor(ctx?: GatewayContext | RpcContext) {
    GrpcImpl.setReceiverServiceInfo({
      serviceName: Config.instance.getConfig(ConfigConst.CONNECT_MEMCACHED),
      host: Config.instance.getHost(ConfigConst.CONNECT_MEMCACHED),
      port: Config.instance.getPort(ConfigConst.CONNECT_MEMCACHED)
    });

    this.client = new GrpcImpl().createClient(
      new MemcachedServiceClient(
        Config.instance.getAddress(ConfigConst.CONNECT_MEMCACHED),
        grpc.credentials.createInsecure()
      ),
      ctx
    );
  }

  public memSet(request: SetRequest): Promise<BoolResponse> {
    return new Promise((resolve, reject) => {
      this.client.memSet(request, (err, res: BoolResponse) => {
        if (err) {
          return reject(err);
        }
        return resolve(res);
      });
    });
  }
  public memSetMulti(request: SetMultiRequest): Promise<BoolsResponse> {
    return new Promise((resolve, reject) => {
      this.client.memSetMulti(request, (err, res: BoolsResponse) => {
        if (err) {
          return reject(err);
        }
        return resolve(res);
      });
    });
  }
  public memAdd(request: AddRequest): Promise<BoolResponse> {
    return new Promise((resolve, reject) => {
      this.client.memAdd(request, (err, res: BoolResponse) => {
        if (err) {
          return reject(err);
        }
        return resolve(res);
      });
    });
  }
  public memDel(request: DelRequest): Promise<BoolResponse> {
    return new Promise((resolve, reject) => {
      this.client.memDel(request, (err, res: BoolResponse) => {
        if (err) {
          return reject(err);
        }
        return resolve(res);
      });
    });
  }
  public memGet(request: GetRequest): Promise<DataResponse> {
    return new Promise((resolve, reject) => {
      this.client.memGet(request, (err, res: DataResponse) => {
        if (err) {
          return reject(err);
        }
        return resolve(res);
      });
    });
  }
  public memGetMulti(request: GetMultiRequest): Promise<DatasResponse> {
    return new Promise((resolve, reject) => {
      this.client.memGetMulti(request, (err, res: DatasResponse) => {
        if (err) {
          return reject(err);
        }
        return resolve(res);
      });
    });
  }
}