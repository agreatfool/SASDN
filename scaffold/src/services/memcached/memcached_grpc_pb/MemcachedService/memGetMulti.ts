import {ServerUnaryCall, sendUnaryData as GrpcSendUnaryData} from 'grpc';
import {RpcContext, RpcMiddleware, MiddlewareNext} from 'sasdn';
import {GetMultiRequest, DatasResponse, } from '../../../../proto/memcached/memcached_pb';

export const memGetMultiHandler: RpcMiddleware = async (ctx: RpcContext, next: MiddlewareNext) => {
  let call: ServerUnaryCall<GetMultiRequest> = ctx.call as ServerUnaryCall<GetMultiRequest>;
  let callback: GrpcSendUnaryData<DatasResponse> = ctx.callback;
  let request = call.request as GetMultiRequest;

  await next();

  return Promise.resolve();
};