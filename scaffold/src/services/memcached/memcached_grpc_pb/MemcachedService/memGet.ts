import {ServerUnaryCall, sendUnaryData as GrpcSendUnaryData} from 'grpc';
import {RpcContext, RpcMiddleware, MiddlewareNext} from 'sasdn';
import {GetRequest, DataResponse, } from '../../../../proto/memcached/memcached_pb';

export const memGetHandler: RpcMiddleware = async (ctx: RpcContext, next: MiddlewareNext) => {
  let call: ServerUnaryCall<GetRequest> = ctx.call as ServerUnaryCall<GetRequest>;
  let callback: GrpcSendUnaryData<DataResponse> = ctx.callback;
  let request = call.request as GetRequest;

  await next();

  return Promise.resolve();
};