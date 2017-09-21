// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var demo_pb = require('./demo_pb.js');
var google_api_annotations_pb = require('./google/api/annotations_pb.js');

function serialize_demo_Demo(arg) {
  if (!(arg instanceof demo_pb.Demo)) {
    throw new Error('Expected argument of type demo.Demo');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_demo_Demo(buffer_arg) {
  return demo_pb.Demo.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_demo_GetDemoRequest(arg) {
  if (!(arg instanceof demo_pb.GetDemoRequest)) {
    throw new Error('Expected argument of type demo.GetDemoRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_demo_GetDemoRequest(buffer_arg) {
  return demo_pb.GetDemoRequest.deserializeBinary(new Uint8Array(buffer_arg));
}


var DemoServiceService = exports.DemoServiceService = {
  getDemo: {
    path: '/demo.DemoService/GetDemo',
    requestStream: false,
    responseStream: false,
    requestType: demo_pb.GetDemoRequest,
    responseType: demo_pb.Demo,
    requestSerialize: serialize_demo_GetDemoRequest,
    requestDeserialize: deserialize_demo_GetDemoRequest,
    responseSerialize: serialize_demo_Demo,
    responseDeserialize: deserialize_demo_Demo,
  },
};

exports.DemoServiceClient = grpc.makeGenericClientConstructor(DemoServiceService);
// gPRC-getway Test
var DemoApiServiceService = exports.DemoApiServiceService = {
  getDemoApi: {
    path: '/demo.DemoApiService/GetDemoApi',
    requestStream: false,
    responseStream: false,
    requestType: demo_pb.GetDemoRequest,
    responseType: demo_pb.Demo,
    requestSerialize: serialize_demo_GetDemoRequest,
    requestDeserialize: deserialize_demo_GetDemoRequest,
    responseSerialize: serialize_demo_Demo,
    responseDeserialize: deserialize_demo_Demo,
  },
};

exports.DemoApiServiceClient = grpc.makeGenericClientConstructor(DemoApiServiceService);
