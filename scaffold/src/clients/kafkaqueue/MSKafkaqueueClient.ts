import * as grpc from 'grpc';
import { GatewayContext, RpcContext } from "sasdn";
import { Config, ConfigConst } from '../../lib/Config';
import { GrpcImpl } from 'sasdn-zipkin';

import {
  KafkaQueueServiceClient,
} from "../../proto/kafkaqueue/kafkaqueue_grpc_pb";
import {
  SendRequest,
  SendResponse,
} from "../../proto/kafkaqueue/kafkaqueue_pb";

export default class MSKafkaqueueClient {
  public client: KafkaQueueServiceClient;

  constructor(ctx?: GatewayContext | RpcContext) {
    GrpcImpl.setReceiverServiceInfo({
      serviceName: Config.instance.getConfig(ConfigConst.CONNECT_KAFKAQUEUE),
      host: Config.instance.getHost(ConfigConst.CONNECT_KAFKAQUEUE),
      port: Config.instance.getPort(ConfigConst.CONNECT_KAFKAQUEUE)
    });

    this.client = new GrpcImpl().createClient(
      new KafkaQueueServiceClient(
        Config.instance.getAddress(ConfigConst.CONNECT_KAFKAQUEUE),
        grpc.credentials.createInsecure()
      ),
      ctx
    );
  }

  public send(request: SendRequest): Promise<SendResponse> {
    return new Promise((resolve, reject) => {
      this.client.send(request, (err, res: SendResponse) => {
        if (err) {
          return reject(err);
        }
        return resolve(res);
      });
    });
  }
}