import {ServerUnaryCall, sendUnaryData as GrpcSendUnaryData} from 'grpc';
import {RpcContext, RpcMiddleware, MiddlewareNext} from 'sasdn';
import {SendRequest, SendResponse, } from '../../../../proto/kafkaqueue/kafkaqueue_pb';

export const sendHandler: RpcMiddleware = async (ctx: RpcContext, next: MiddlewareNext) => {
  let call: ServerUnaryCall<SendRequest> = ctx.call as ServerUnaryCall<SendRequest>;
  let callback: GrpcSendUnaryData<SendResponse> = ctx.callback;
  let request = call.request as SendRequest;

  await next();

  return Promise.resolve();
};