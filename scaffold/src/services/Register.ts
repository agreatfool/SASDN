import { sendUnaryData as GrpcSendUnaryData } from 'grpc';
import { RpcApplication, WrappedHandler, GrpcServerCall } from 'sasdn';

import {
  KafkaQueueServiceService,
} from '../proto/kafkaqueue/kafkaqueue_grpc_pb';
import {
  SendRequest,
  SendResponse,
} from '../proto/kafkaqueue/kafkaqueue_pb';
import {
  MemcachedServiceService,
} from '../proto/memcached/memcached_grpc_pb';
import {
  SetRequest,
  BoolResponse,
  SetMultiRequest,
  BoolsResponse,
  AddRequest,
  DelRequest,
  GetRequest,
  DataResponse,
  GetMultiRequest,
  DatasResponse,
} from '../proto/memcached/memcached_pb';
import {
  OrderServiceService,
} from '../proto/order/order_grpc_pb';
import {
  GetOrderRequest,
  Order,
} from '../proto/order/order_pb';



import { sendHandler } from './kafkaqueue/kafkaqueue_grpc_pb/KafkaQueueService/send';


import { memSetHandler } from './memcached/memcached_grpc_pb/MemcachedService/memSet';
import { memSetMultiHandler } from './memcached/memcached_grpc_pb/MemcachedService/memSetMulti';
import { memAddHandler } from './memcached/memcached_grpc_pb/MemcachedService/memAdd';
import { memDelHandler } from './memcached/memcached_grpc_pb/MemcachedService/memDel';
import { memGetHandler } from './memcached/memcached_grpc_pb/MemcachedService/memGet';
import { memGetMultiHandler } from './memcached/memcached_grpc_pb/MemcachedService/memGetMulti';


import { getOrderHandler } from './order/order_grpc_pb/OrderService/getOrder';

export const registerServices = function (app: RpcApplication) {

  app.server.addService(KafkaQueueServiceService, {
    send: async (call: GrpcServerCall<SendRequest, SendResponse>, callback: GrpcSendUnaryData<SendResponse>) => {
      let wrappedHandler: WrappedHandler = app.wrapGrpcHandler(sendHandler);
      wrappedHandler(call, callback).then(_ => _);
    },
  });

  app.server.addService(MemcachedServiceService, {
    memSet: async (call: GrpcServerCall<SetRequest, BoolResponse>, callback: GrpcSendUnaryData<BoolResponse>) => {
      let wrappedHandler: WrappedHandler = app.wrapGrpcHandler(memSetHandler);
      wrappedHandler(call, callback).then(_ => _);
    },
    memSetMulti: async (call: GrpcServerCall<SetMultiRequest, BoolsResponse>, callback: GrpcSendUnaryData<BoolsResponse>) => {
      let wrappedHandler: WrappedHandler = app.wrapGrpcHandler(memSetMultiHandler);
      wrappedHandler(call, callback).then(_ => _);
    },
    memAdd: async (call: GrpcServerCall<AddRequest, BoolResponse>, callback: GrpcSendUnaryData<BoolResponse>) => {
      let wrappedHandler: WrappedHandler = app.wrapGrpcHandler(memAddHandler);
      wrappedHandler(call, callback).then(_ => _);
    },
    memDel: async (call: GrpcServerCall<DelRequest, BoolResponse>, callback: GrpcSendUnaryData<BoolResponse>) => {
      let wrappedHandler: WrappedHandler = app.wrapGrpcHandler(memDelHandler);
      wrappedHandler(call, callback).then(_ => _);
    },
    memGet: async (call: GrpcServerCall<GetRequest, DataResponse>, callback: GrpcSendUnaryData<DataResponse>) => {
      let wrappedHandler: WrappedHandler = app.wrapGrpcHandler(memGetHandler);
      wrappedHandler(call, callback).then(_ => _);
    },
    memGetMulti: async (call: GrpcServerCall<GetMultiRequest, DatasResponse>, callback: GrpcSendUnaryData<DatasResponse>) => {
      let wrappedHandler: WrappedHandler = app.wrapGrpcHandler(memGetMultiHandler);
      wrappedHandler(call, callback).then(_ => _);
    },
  });

  app.server.addService(OrderServiceService, {
    getOrder: async (call: GrpcServerCall<GetOrderRequest, Order>, callback: GrpcSendUnaryData<Order>) => {
      let wrappedHandler: WrappedHandler = app.wrapGrpcHandler(getOrderHandler);
      wrappedHandler(call, callback).then(_ => _);
    },
  });

};