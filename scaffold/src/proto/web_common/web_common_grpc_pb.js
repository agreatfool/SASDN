// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var web_common_web_common_pb = require('../web_common/web_common_pb.js');
var google_api_annotations_pb = require('../google/api/annotations_pb.js');

function serialize_web_common_LoginReq(arg) {
  if (!(arg instanceof web_common_web_common_pb.LoginReq)) {
    throw new Error('Expected argument of type web_common.LoginReq');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_web_common_LoginReq(buffer_arg) {
  return web_common_web_common_pb.LoginReq.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_web_common_LoginRes(arg) {
  if (!(arg instanceof web_common_web_common_pb.LoginRes)) {
    throw new Error('Expected argument of type web_common.LoginRes');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_web_common_LoginRes(buffer_arg) {
  return web_common_web_common_pb.LoginRes.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_web_common_LogoutReq(arg) {
  if (!(arg instanceof web_common_web_common_pb.LogoutReq)) {
    throw new Error('Expected argument of type web_common.LogoutReq');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_web_common_LogoutReq(buffer_arg) {
  return web_common_web_common_pb.LogoutReq.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_web_common_LogoutRes(arg) {
  if (!(arg instanceof web_common_web_common_pb.LogoutRes)) {
    throw new Error('Expected argument of type web_common.LogoutRes');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_web_common_LogoutRes(buffer_arg) {
  return web_common_web_common_pb.LogoutRes.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_web_common_UploadingUrlGetReq(arg) {
  if (!(arg instanceof web_common_web_common_pb.UploadingUrlGetReq)) {
    throw new Error('Expected argument of type web_common.UploadingUrlGetReq');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_web_common_UploadingUrlGetReq(buffer_arg) {
  return web_common_web_common_pb.UploadingUrlGetReq.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_web_common_UploadingUrlGetRes(arg) {
  if (!(arg instanceof web_common_web_common_pb.UploadingUrlGetRes)) {
    throw new Error('Expected argument of type web_common.UploadingUrlGetRes');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_web_common_UploadingUrlGetRes(buffer_arg) {
  return web_common_web_common_pb.UploadingUrlGetRes.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_web_common_UserKickOffReq(arg) {
  if (!(arg instanceof web_common_web_common_pb.UserKickOffReq)) {
    throw new Error('Expected argument of type web_common.UserKickOffReq');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_web_common_UserKickOffReq(buffer_arg) {
  return web_common_web_common_pb.UserKickOffReq.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_web_common_UserKickOffRes(arg) {
  if (!(arg instanceof web_common_web_common_pb.UserKickOffRes)) {
    throw new Error('Expected argument of type web_common.UserKickOffRes');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_web_common_UserKickOffRes(buffer_arg) {
  return web_common_web_common_pb.UserKickOffRes.deserializeBinary(new Uint8Array(buffer_arg));
}


var CommonApiServiceService = exports.CommonApiServiceService = {
  // *
  // {
  // "Desc": "后台用户登录"
  // }
  login: {
    path: '/web_common.CommonApiService/Login',
    requestStream: false,
    responseStream: false,
    requestType: web_common_web_common_pb.LoginReq,
    responseType: web_common_web_common_pb.LoginRes,
    requestSerialize: serialize_web_common_LoginReq,
    requestDeserialize: deserialize_web_common_LoginReq,
    responseSerialize: serialize_web_common_LoginRes,
    responseDeserialize: deserialize_web_common_LoginRes,
  },
  // *
  // {
  // "Desc": "后台用户登出"
  // }
  logout: {
    path: '/web_common.CommonApiService/Logout',
    requestStream: false,
    responseStream: false,
    requestType: web_common_web_common_pb.LogoutReq,
    responseType: web_common_web_common_pb.LogoutRes,
    requestSerialize: serialize_web_common_LogoutReq,
    requestDeserialize: deserialize_web_common_LogoutReq,
    responseSerialize: serialize_web_common_LogoutRes,
    responseDeserialize: deserialize_web_common_LogoutRes,
  },
  // *
  // {
  // "Desc": "获取上传文件 url"
  // }
  getUploadingUrl: {
    path: '/web_common.CommonApiService/GetUploadingUrl',
    requestStream: false,
    responseStream: false,
    requestType: web_common_web_common_pb.UploadingUrlGetReq,
    responseType: web_common_web_common_pb.UploadingUrlGetRes,
    requestSerialize: serialize_web_common_UploadingUrlGetReq,
    requestDeserialize: deserialize_web_common_UploadingUrlGetReq,
    responseSerialize: serialize_web_common_UploadingUrlGetRes,
    responseDeserialize: deserialize_web_common_UploadingUrlGetRes,
  },
  // *
  // {
  // "Desc": "强制踢人下线"
  // }
  kickOffUser: {
    path: '/web_common.CommonApiService/KickOffUser',
    requestStream: false,
    responseStream: false,
    requestType: web_common_web_common_pb.UserKickOffReq,
    responseType: web_common_web_common_pb.UserKickOffRes,
    requestSerialize: serialize_web_common_UserKickOffReq,
    requestDeserialize: deserialize_web_common_UserKickOffReq,
    responseSerialize: serialize_web_common_UserKickOffRes,
    responseDeserialize: deserialize_web_common_UserKickOffRes,
  },
};

exports.CommonApiServiceClient = grpc.makeGenericClientConstructor(CommonApiServiceService);
