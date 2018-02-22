import {ServerUnaryCall, sendUnaryData as GrpcSendUnaryData} from 'grpc';
import {RpcContext, RpcMiddleware, MiddlewareNext} from 'sasdn';
import {SetRequest, BoolResponse, } from '../../../../proto/memcached/memcached_pb';

export const memSetHandler: RpcMiddleware = async (ctx: RpcContext, next: MiddlewareNext) => {
  let call: ServerUnaryCall<SetRequest> = ctx.call as ServerUnaryCall<SetRequest>;
  let callback: GrpcSendUnaryData<BoolResponse> = ctx.callback;
  let request = call.request as SetRequest;

  await next();

  return Promise.resolve();
};