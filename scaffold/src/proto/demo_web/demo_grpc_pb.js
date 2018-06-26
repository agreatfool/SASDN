// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var demo_demo_pb = require('../demo/demo_pb.js');
var google_api_annotations_pb = require('../google/api/annotations_pb.js');

function serialize_demo_GetDemoOrderRequest(arg) {
  if (!(arg instanceof demo_demo_pb.GetDemoOrderRequest)) {
    throw new Error('Expected argument of type demo.GetDemoOrderRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_demo_GetDemoOrderRequest(buffer_arg) {
  return demo_demo_pb.GetDemoOrderRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_demo_GetDemoOrderResponse(arg) {
  if (!(arg instanceof demo_demo_pb.GetDemoOrderResponse)) {
    throw new Error('Expected argument of type demo.GetDemoOrderResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_demo_GetDemoOrderResponse(buffer_arg) {
  return demo_demo_pb.GetDemoOrderResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


// gPRC-Gateway Demo
var DemoApiServiceService = exports.DemoApiServiceService = {
  // *
  // {
  // "Desc": "This is GetDemoOrderApi Description"
  // }
  getDemoOrderApi: {
    path: '/demo.DemoApiService/GetDemoOrderApi',
    requestStream: false,
    responseStream: false,
    requestType: demo_demo_pb.GetDemoOrderRequest,
    responseType: demo_demo_pb.GetDemoOrderResponse,
    requestSerialize: serialize_demo_GetDemoOrderRequest,
    requestDeserialize: deserialize_demo_GetDemoOrderRequest,
    responseSerialize: serialize_demo_GetDemoOrderResponse,
    responseDeserialize: deserialize_demo_GetDemoOrderResponse,
  },
};

exports.DemoApiServiceClient = grpc.makeGenericClientConstructor(DemoApiServiceService);
