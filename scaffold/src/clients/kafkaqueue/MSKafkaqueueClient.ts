import * as grpc from 'grpc';
import { GatewayContext, RpcContext } from "sasdn";
import { Config, ConnectKey } from '../../lib/Config';
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
      serviceName: Config.instance.getConfig(ConnectKey.Kafkaqueue),
      host: Config.instance.getHost(ConnectKey.Kafkaqueue),
      port: Config.instance.getPort(ConnectKey.Kafkaqueue)
    });

    this.client = new GrpcImpl().createClient(
      new KafkaQueueServiceClient(
        Config.instance.getAddress(ConnectKey.Kafkaqueue),
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