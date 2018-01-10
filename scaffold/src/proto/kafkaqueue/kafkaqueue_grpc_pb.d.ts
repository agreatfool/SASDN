// package: kafkaqueue
// file: kafkaqueue/kafkaqueue.proto

import * as grpc from "grpc";
import * as kafkaqueue_kafkaqueue_pb from "../kafkaqueue/kafkaqueue_pb";

interface IKafkaQueueServiceService extends grpc.IMethodsMap {
    send: ISend;
}

interface ISend {
    path: string; // "/kafkaqueue.KafkaQueueService/Send"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestType: kafkaqueue_kafkaqueue_pb.SendRequest,
    responseType: kafkaqueue_kafkaqueue_pb.SendResponse,
    requestSerialize: (arg: kafkaqueue_kafkaqueue_pb.SendRequest) => Buffer;
    requestDeserialize: (buffer: Uint8Array) => kafkaqueue_kafkaqueue_pb.SendRequest;
    responseSerialize: (arg: kafkaqueue_kafkaqueue_pb.SendResponse) => Buffer;
    responseDeserialize: (buffer: Uint8Array) => kafkaqueue_kafkaqueue_pb.SendResponse;
}

export const KafkaQueueServiceService: IKafkaQueueServiceService;
export class KafkaQueueServiceClient extends grpc.Client {
    constructor(address: string, credentials: any, options?: grpc.IClientOptions);
    send(request: kafkaqueue_kafkaqueue_pb.SendRequest, callback: (error: Error | null, response: kafkaqueue_kafkaqueue_pb.SendResponse) => void): grpc.ClientUnaryCall;
    send(request: kafkaqueue_kafkaqueue_pb.SendRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: kafkaqueue_kafkaqueue_pb.SendResponse) => void): grpc.ClientUnaryCall;
}
