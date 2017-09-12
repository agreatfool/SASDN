// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var order_order_pb = require('../order/order_pb.js');
var google_api_annotations_pb = require('../google/api/annotations_pb.js');

function serialize_order_GetOrderRequest(arg) {
  if (!(arg instanceof order_order_pb.GetOrderRequest)) {
    throw new Error('Expected argument of type order.GetOrderRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_order_GetOrderRequest(buffer_arg) {
  return order_order_pb.GetOrderRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_order_Order(arg) {
  if (!(arg instanceof order_order_pb.Order)) {
    throw new Error('Expected argument of type order.Order');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_order_Order(buffer_arg) {
  return order_order_pb.Order.deserializeBinary(new Uint8Array(buffer_arg));
}


var OrderServiceService = exports.OrderServiceService = {
  getOrder: {
    path: '/order.OrderService/GetOrder',
    requestStream: false,
    responseStream: false,
    requestType: order_order_pb.GetOrderRequest,
    responseType: order_order_pb.Order,
    requestSerialize: serialize_order_GetOrderRequest,
    requestDeserialize: deserialize_order_GetOrderRequest,
    responseSerialize: serialize_order_Order,
    responseDeserialize: deserialize_order_Order,
  },
};

exports.OrderServiceClient = grpc.makeGenericClientConstructor(OrderServiceService);
// gPRC-getway Test
var OrderApiServiceService = exports.OrderApiServiceService = {
  getOrderApi: {
    path: '/order.OrderApiService/GetOrderApi',
    requestStream: false,
    responseStream: false,
    requestType: order_order_pb.GetOrderRequest,
    responseType: order_order_pb.Order,
    requestSerialize: serialize_order_GetOrderRequest,
    requestDeserialize: deserialize_order_GetOrderRequest,
    responseSerialize: serialize_order_Order,
    responseDeserialize: deserialize_order_Order,
  },
};

exports.OrderApiServiceClient = grpc.makeGenericClientConstructor(OrderApiServiceService);
