import {ServerUnaryCall, sendUnaryData as GrpcSendUnaryData} from 'grpc';
import {RpcContext, RpcMiddleware, MiddlewareNext} from 'sasdn';
import {AddRequest, BoolResponse, } from '../../../../proto/memcached/memcached_pb';

export const memAddHandler: RpcMiddleware = async (ctx: RpcContext, next: MiddlewareNext) => {
  let call: ServerUnaryCall<AddRequest> = ctx.call as ServerUnaryCall<AddRequest>;
  let callback: GrpcSendUnaryData<BoolResponse> = ctx.callback;
  let request = call.request as AddRequest;

  await next();

  return Promise.resolve();
};