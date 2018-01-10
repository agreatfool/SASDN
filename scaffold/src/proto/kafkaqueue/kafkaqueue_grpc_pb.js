// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var kafkaqueue_kafkaqueue_pb = require('../kafkaqueue/kafkaqueue_pb.js');

function serialize_kafkaqueue_SendRequest(arg) {
  if (!(arg instanceof kafkaqueue_kafkaqueue_pb.SendRequest)) {
    throw new Error('Expected argument of type kafkaqueue.SendRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_kafkaqueue_SendRequest(buffer_arg) {
  return kafkaqueue_kafkaqueue_pb.SendRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_kafkaqueue_SendResponse(arg) {
  if (!(arg instanceof kafkaqueue_kafkaqueue_pb.SendResponse)) {
    throw new Error('Expected argument of type kafkaqueue.SendResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_kafkaqueue_SendResponse(buffer_arg) {
  return kafkaqueue_kafkaqueue_pb.SendResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var KafkaQueueServiceService = exports.KafkaQueueServiceService = {
  send: {
    path: '/kafkaqueue.KafkaQueueService/Send',
    requestStream: false,
    responseStream: false,
    requestType: kafkaqueue_kafkaqueue_pb.SendRequest,
    responseType: kafkaqueue_kafkaqueue_pb.SendResponse,
    requestSerialize: serialize_kafkaqueue_SendRequest,
    requestDeserialize: deserialize_kafkaqueue_SendRequest,
    responseSerialize: serialize_kafkaqueue_SendResponse,
    responseDeserialize: deserialize_kafkaqueue_SendResponse,
  },
};

exports.KafkaQueueServiceClient = grpc.makeGenericClientConstructor(KafkaQueueServiceService);
