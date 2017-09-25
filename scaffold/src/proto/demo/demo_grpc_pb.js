// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var demo_demo_pb = require('../demo/demo_pb.js');
var google_api_annotations_pb = require('../google/api/annotations_pb.js');
var order_order_pb = require('../order/order_pb.js');

function serialize_demo_GetDemoRequest(arg) {
  if (!(arg instanceof demo_demo_pb.GetDemoRequest)) {
    throw new Error('Expected argument of type demo.GetDemoRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_demo_GetDemoRequest(buffer_arg) {
  return demo_demo_pb.GetDemoRequest.deserializeBinary(new Uint8Array(buffer_arg));
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


var DemoServiceService = exports.DemoServiceService = {
  getDemo: {
    path: '/demo.DemoService/GetDemo',
    requestStream: false,
    responseStream: false,
    requestType: demo_demo_pb.GetDemoRequest,
    responseType: order_order_pb.Order,
    requestSerialize: serialize_demo_GetDemoRequest,
    requestDeserialize: deserialize_demo_GetDemoRequest,
    responseSerialize: serialize_order_Order,
    responseDeserialize: deserialize_order_Order,
  },
};

exports.DemoServiceClient = grpc.makeGenericClientConstructor(DemoServiceService);
// gPRC-getway Test
var DemoApiServiceService = exports.DemoApiServiceService = {
  getDemoApi: {
    path: '/demo.DemoApiService/GetDemoApi',
    requestStream: false,
    responseStream: false,
    requestType: demo_demo_pb.GetDemoRequest,
    responseType: order_order_pb.Order,
    requestSerialize: serialize_demo_GetDemoRequest,
    requestDeserialize: deserialize_demo_GetDemoRequest,
    responseSerialize: serialize_order_Order,
    responseDeserialize: deserialize_order_Order,
  },
};

exports.DemoApiServiceClient = grpc.makeGenericClientConstructor(DemoApiServiceService);
