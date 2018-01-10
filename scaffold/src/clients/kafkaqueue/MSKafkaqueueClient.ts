import * as grpc from 'grpc';
import { GatewayContext, RpcContext } from "sasdn";
import { ConfigHelper, ConfigKey } from '../../helper/ConfigHelper';
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
      serviceName: ConfigHelper.instance.getConfig(ConfigKey.Kafkaqueue),
      host: ConfigHelper.instance.getHost(ConfigKey.Kafkaqueue),
      port: ConfigHelper.instance.getPort(ConfigKey.Kafkaqueue)
    });

    this.client = new GrpcImpl().createClient(
      new KafkaQueueServiceClient(
        ConfigHelper.instance.getAddress(ConfigKey.Kafkaqueue),
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