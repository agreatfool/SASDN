import {ServerUnaryCall, sendUnaryData as GrpcSendUnaryData} from 'grpc';
import {RpcContext, RpcMiddleware, MiddlewareNext} from 'sasdn';
import {DelRequest, BoolResponse, } from '../../../../proto/memcached/memcached_pb';

export const memDelHandler: RpcMiddleware = async (ctx: RpcContext, next: MiddlewareNext) => {
  let call: ServerUnaryCall<DelRequest> = ctx.call as ServerUnaryCall<DelRequest>;
  let callback: GrpcSendUnaryData<BoolResponse> = ctx.callback;
  let request = call.request as DelRequest;

  await next();

  return Promise.resolve();
};