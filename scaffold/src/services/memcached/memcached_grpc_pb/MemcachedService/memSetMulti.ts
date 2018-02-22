import {ServerUnaryCall, sendUnaryData as GrpcSendUnaryData} from 'grpc';
import {RpcContext, RpcMiddleware, MiddlewareNext} from 'sasdn';
import {SetMultiRequest, BoolsResponse, } from '../../../../proto/memcached/memcached_pb';

export const memSetMultiHandler: RpcMiddleware = async (ctx: RpcContext, next: MiddlewareNext) => {
  let call: ServerUnaryCall<SetMultiRequest> = ctx.call as ServerUnaryCall<SetMultiRequest>;
  let callback: GrpcSendUnaryData<BoolsResponse> = ctx.callback;
  let request = call.request as SetMultiRequest;

  await next();

  return Promise.resolve();
};