// package: memcached
// file: memcached/memcached.proto

/* tslint:disable */

import * as grpc from "grpc";
import * as memcached_memcached_pb from "../memcached/memcached_pb";

interface IMemcachedServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    memSet: IMemSet;
    memSetMulti: IMemSetMulti;
    memAdd: IMemAdd;
    memDel: IMemDel;
    memGet: IMemGet;
    memGetMulti: IMemGetMulti;
}

interface IMemSet {
    path: string; // "/memcached.MemcachedService/MemSet"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestType: memcached_memcached_pb.SetRequest;
    responseType: memcached_memcached_pb.BoolResponse;
    requestSerialize: (arg: memcached_memcached_pb.SetRequest) => Buffer;
    requestDeserialize: (buffer: Uint8Array) => memcached_memcached_pb.SetRequest;
    responseSerialize: (arg: memcached_memcached_pb.BoolResponse) => Buffer;
    responseDeserialize: (buffer: Uint8Array) => memcached_memcached_pb.BoolResponse;
}
interface IMemSetMulti {
    path: string; // "/memcached.MemcachedService/MemSetMulti"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestType: memcached_memcached_pb.SetMultiRequest;
    responseType: memcached_memcached_pb.BoolsResponse;
    requestSerialize: (arg: memcached_memcached_pb.SetMultiRequest) => Buffer;
    requestDeserialize: (buffer: Uint8Array) => memcached_memcached_pb.SetMultiRequest;
    responseSerialize: (arg: memcached_memcached_pb.BoolsResponse) => Buffer;
    responseDeserialize: (buffer: Uint8Array) => memcached_memcached_pb.BoolsResponse;
}
interface IMemAdd {
    path: string; // "/memcached.MemcachedService/MemAdd"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestType: memcached_memcached_pb.AddRequest;
    responseType: memcached_memcached_pb.BoolResponse;
    requestSerialize: (arg: memcached_memcached_pb.AddRequest) => Buffer;
    requestDeserialize: (buffer: Uint8Array) => memcached_memcached_pb.AddRequest;
    responseSerialize: (arg: memcached_memcached_pb.BoolResponse) => Buffer;
    responseDeserialize: (buffer: Uint8Array) => memcached_memcached_pb.BoolResponse;
}
interface IMemDel {
    path: string; // "/memcached.MemcachedService/MemDel"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestType: memcached_memcached_pb.DelRequest;
    responseType: memcached_memcached_pb.BoolResponse;
    requestSerialize: (arg: memcached_memcached_pb.DelRequest) => Buffer;
    requestDeserialize: (buffer: Uint8Array) => memcached_memcached_pb.DelRequest;
    responseSerialize: (arg: memcached_memcached_pb.BoolResponse) => Buffer;
    responseDeserialize: (buffer: Uint8Array) => memcached_memcached_pb.BoolResponse;
}
interface IMemGet {
    path: string; // "/memcached.MemcachedService/MemGet"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestType: memcached_memcached_pb.GetRequest;
    responseType: memcached_memcached_pb.DataResponse;
    requestSerialize: (arg: memcached_memcached_pb.GetRequest) => Buffer;
    requestDeserialize: (buffer: Uint8Array) => memcached_memcached_pb.GetRequest;
    responseSerialize: (arg: memcached_memcached_pb.DataResponse) => Buffer;
    responseDeserialize: (buffer: Uint8Array) => memcached_memcached_pb.DataResponse;
}
interface IMemGetMulti {
    path: string; // "/memcached.MemcachedService/MemGetMulti"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestType: memcached_memcached_pb.GetMultiRequest;
    responseType: memcached_memcached_pb.DatasResponse;
    requestSerialize: (arg: memcached_memcached_pb.GetMultiRequest) => Buffer;
    requestDeserialize: (buffer: Uint8Array) => memcached_memcached_pb.GetMultiRequest;
    responseSerialize: (arg: memcached_memcached_pb.DatasResponse) => Buffer;
    responseDeserialize: (buffer: Uint8Array) => memcached_memcached_pb.DatasResponse;
}

export interface IMemcachedServiceClient {
    memSet(request: memcached_memcached_pb.SetRequest, callback: (error: Error | null, response: memcached_memcached_pb.BoolResponse) => void): grpc.ClientUnaryCall;
    memSet(request: memcached_memcached_pb.SetRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: memcached_memcached_pb.BoolResponse) => void): grpc.ClientUnaryCall;
    memSetMulti(request: memcached_memcached_pb.SetMultiRequest, callback: (error: Error | null, response: memcached_memcached_pb.BoolsResponse) => void): grpc.ClientUnaryCall;
    memSetMulti(request: memcached_memcached_pb.SetMultiRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: memcached_memcached_pb.BoolsResponse) => void): grpc.ClientUnaryCall;
    memAdd(request: memcached_memcached_pb.AddRequest, callback: (error: Error | null, response: memcached_memcached_pb.BoolResponse) => void): grpc.ClientUnaryCall;
    memAdd(request: memcached_memcached_pb.AddRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: memcached_memcached_pb.BoolResponse) => void): grpc.ClientUnaryCall;
    memDel(request: memcached_memcached_pb.DelRequest, callback: (error: Error | null, response: memcached_memcached_pb.BoolResponse) => void): grpc.ClientUnaryCall;
    memDel(request: memcached_memcached_pb.DelRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: memcached_memcached_pb.BoolResponse) => void): grpc.ClientUnaryCall;
    memGet(request: memcached_memcached_pb.GetRequest, callback: (error: Error | null, response: memcached_memcached_pb.DataResponse) => void): grpc.ClientUnaryCall;
    memGet(request: memcached_memcached_pb.GetRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: memcached_memcached_pb.DataResponse) => void): grpc.ClientUnaryCall;
    memGetMulti(request: memcached_memcached_pb.GetMultiRequest, callback: (error: Error | null, response: memcached_memcached_pb.DatasResponse) => void): grpc.ClientUnaryCall;
    memGetMulti(request: memcached_memcached_pb.GetMultiRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: memcached_memcached_pb.DatasResponse) => void): grpc.ClientUnaryCall;
}

export const MemcachedServiceService: IMemcachedServiceService;
export class MemcachedServiceClient extends grpc.Client implements IMemcachedServiceClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public memSet(request: memcached_memcached_pb.SetRequest, callback: (error: Error | null, response: memcached_memcached_pb.BoolResponse) => void): grpc.ClientUnaryCall;
    public memSet(request: memcached_memcached_pb.SetRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: memcached_memcached_pb.BoolResponse) => void): grpc.ClientUnaryCall;
    public memSetMulti(request: memcached_memcached_pb.SetMultiRequest, callback: (error: Error | null, response: memcached_memcached_pb.BoolsResponse) => void): grpc.ClientUnaryCall;
    public memSetMulti(request: memcached_memcached_pb.SetMultiRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: memcached_memcached_pb.BoolsResponse) => void): grpc.ClientUnaryCall;
    public memAdd(request: memcached_memcached_pb.AddRequest, callback: (error: Error | null, response: memcached_memcached_pb.BoolResponse) => void): grpc.ClientUnaryCall;
    public memAdd(request: memcached_memcached_pb.AddRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: memcached_memcached_pb.BoolResponse) => void): grpc.ClientUnaryCall;
    public memDel(request: memcached_memcached_pb.DelRequest, callback: (error: Error | null, response: memcached_memcached_pb.BoolResponse) => void): grpc.ClientUnaryCall;
    public memDel(request: memcached_memcached_pb.DelRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: memcached_memcached_pb.BoolResponse) => void): grpc.ClientUnaryCall;
    public memGet(request: memcached_memcached_pb.GetRequest, callback: (error: Error | null, response: memcached_memcached_pb.DataResponse) => void): grpc.ClientUnaryCall;
    public memGet(request: memcached_memcached_pb.GetRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: memcached_memcached_pb.DataResponse) => void): grpc.ClientUnaryCall;
    public memGetMulti(request: memcached_memcached_pb.GetMultiRequest, callback: (error: Error | null, response: memcached_memcached_pb.DatasResponse) => void): grpc.ClientUnaryCall;
    public memGetMulti(request: memcached_memcached_pb.GetMultiRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: memcached_memcached_pb.DatasResponse) => void): grpc.ClientUnaryCall;
}
