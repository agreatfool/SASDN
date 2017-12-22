// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var demo_demo_pb = require('../demo/demo_pb.js');
var google_api_annotations_pb = require('../google/api/annotations_pb.js');
var order_order_pb = require('../order/order_pb.js');

function serialize_demo_GetDemoOrderRequest(arg) {
  if (!(arg instanceof demo_demo_pb.GetDemoOrderRequest)) {
    throw new Error('Expected argument of type demo.GetDemoOrderRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_demo_GetDemoOrderRequest(buffer_arg) {
  return demo_demo_pb.GetDemoOrderRequest.deserializeBinary(new Uint8Array(buffer_arg));
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


// gPRC-getway Test
var DemoApiServiceService = exports.DemoApiServiceService = {
  getDemoOrderApi: {
    path: '/demo.DemoApiService/GetDemoOrderApi',
    requestStream: false,
    responseStream: false,
    requestType: demo_demo_pb.GetDemoOrderRequest,
    responseType: order_order_pb.Order,
    requestSerialize: serialize_demo_GetDemoOrderRequest,
    requestDeserialize: deserialize_demo_GetDemoOrderRequest,
    responseSerialize: serialize_order_Order,
    responseDeserialize: deserialize_order_Order,
  },
};

exports.DemoApiServiceClient = grpc.makeGenericClientConstructor(DemoApiServiceService);
