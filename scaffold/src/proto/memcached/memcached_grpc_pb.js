// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var memcached_memcached_pb = require('../memcached/memcached_pb.js');

function serialize_memcached_AddRequest(arg) {
  if (!(arg instanceof memcached_memcached_pb.AddRequest)) {
    throw new Error('Expected argument of type memcached.AddRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_memcached_AddRequest(buffer_arg) {
  return memcached_memcached_pb.AddRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_memcached_BoolResponse(arg) {
  if (!(arg instanceof memcached_memcached_pb.BoolResponse)) {
    throw new Error('Expected argument of type memcached.BoolResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_memcached_BoolResponse(buffer_arg) {
  return memcached_memcached_pb.BoolResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_memcached_BoolsResponse(arg) {
  if (!(arg instanceof memcached_memcached_pb.BoolsResponse)) {
    throw new Error('Expected argument of type memcached.BoolsResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_memcached_BoolsResponse(buffer_arg) {
  return memcached_memcached_pb.BoolsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_memcached_DataResponse(arg) {
  if (!(arg instanceof memcached_memcached_pb.DataResponse)) {
    throw new Error('Expected argument of type memcached.DataResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_memcached_DataResponse(buffer_arg) {
  return memcached_memcached_pb.DataResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_memcached_DatasResponse(arg) {
  if (!(arg instanceof memcached_memcached_pb.DatasResponse)) {
    throw new Error('Expected argument of type memcached.DatasResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_memcached_DatasResponse(buffer_arg) {
  return memcached_memcached_pb.DatasResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_memcached_DelRequest(arg) {
  if (!(arg instanceof memcached_memcached_pb.DelRequest)) {
    throw new Error('Expected argument of type memcached.DelRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_memcached_DelRequest(buffer_arg) {
  return memcached_memcached_pb.DelRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_memcached_GetMultiRequest(arg) {
  if (!(arg instanceof memcached_memcached_pb.GetMultiRequest)) {
    throw new Error('Expected argument of type memcached.GetMultiRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_memcached_GetMultiRequest(buffer_arg) {
  return memcached_memcached_pb.GetMultiRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_memcached_GetRequest(arg) {
  if (!(arg instanceof memcached_memcached_pb.GetRequest)) {
    throw new Error('Expected argument of type memcached.GetRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_memcached_GetRequest(buffer_arg) {
  return memcached_memcached_pb.GetRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_memcached_SetMultiRequest(arg) {
  if (!(arg instanceof memcached_memcached_pb.SetMultiRequest)) {
    throw new Error('Expected argument of type memcached.SetMultiRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_memcached_SetMultiRequest(buffer_arg) {
  return memcached_memcached_pb.SetMultiRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_memcached_SetRequest(arg) {
  if (!(arg instanceof memcached_memcached_pb.SetRequest)) {
    throw new Error('Expected argument of type memcached.SetRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_memcached_SetRequest(buffer_arg) {
  return memcached_memcached_pb.SetRequest.deserializeBinary(new Uint8Array(buffer_arg));
}


var MemcachedServiceService = exports.MemcachedServiceService = {
  memSet: {
    path: '/memcached.MemcachedService/MemSet',
    requestStream: false,
    responseStream: false,
    requestType: memcached_memcached_pb.SetRequest,
    responseType: memcached_memcached_pb.BoolResponse,
    requestSerialize: serialize_memcached_SetRequest,
    requestDeserialize: deserialize_memcached_SetRequest,
    responseSerialize: serialize_memcached_BoolResponse,
    responseDeserialize: deserialize_memcached_BoolResponse,
  },
  memSetMulti: {
    path: '/memcached.MemcachedService/MemSetMulti',
    requestStream: false,
    responseStream: false,
    requestType: memcached_memcached_pb.SetMultiRequest,
    responseType: memcached_memcached_pb.BoolsResponse,
    requestSerialize: serialize_memcached_SetMultiRequest,
    requestDeserialize: deserialize_memcached_SetMultiRequest,
    responseSerialize: serialize_memcached_BoolsResponse,
    responseDeserialize: deserialize_memcached_BoolsResponse,
  },
  memAdd: {
    path: '/memcached.MemcachedService/MemAdd',
    requestStream: false,
    responseStream: false,
    requestType: memcached_memcached_pb.AddRequest,
    responseType: memcached_memcached_pb.BoolResponse,
    requestSerialize: serialize_memcached_AddRequest,
    requestDeserialize: deserialize_memcached_AddRequest,
    responseSerialize: serialize_memcached_BoolResponse,
    responseDeserialize: deserialize_memcached_BoolResponse,
  },
  memDel: {
    path: '/memcached.MemcachedService/MemDel',
    requestStream: false,
    responseStream: false,
    requestType: memcached_memcached_pb.DelRequest,
    responseType: memcached_memcached_pb.BoolResponse,
    requestSerialize: serialize_memcached_DelRequest,
    requestDeserialize: deserialize_memcached_DelRequest,
    responseSerialize: serialize_memcached_BoolResponse,
    responseDeserialize: deserialize_memcached_BoolResponse,
  },
  memGet: {
    path: '/memcached.MemcachedService/MemGet',
    requestStream: false,
    responseStream: false,
    requestType: memcached_memcached_pb.GetRequest,
    responseType: memcached_memcached_pb.DataResponse,
    requestSerialize: serialize_memcached_GetRequest,
    requestDeserialize: deserialize_memcached_GetRequest,
    responseSerialize: serialize_memcached_DataResponse,
    responseDeserialize: deserialize_memcached_DataResponse,
  },
  memGetMulti: {
    path: '/memcached.MemcachedService/MemGetMulti',
    requestStream: false,
    responseStream: false,
    requestType: memcached_memcached_pb.GetMultiRequest,
    responseType: memcached_memcached_pb.DatasResponse,
    requestSerialize: serialize_memcached_GetMultiRequest,
    requestDeserialize: deserialize_memcached_GetMultiRequest,
    responseSerialize: serialize_memcached_DatasResponse,
    responseDeserialize: deserialize_memcached_DatasResponse,
  },
};

exports.MemcachedServiceClient = grpc.makeGenericClientConstructor(MemcachedServiceService);
