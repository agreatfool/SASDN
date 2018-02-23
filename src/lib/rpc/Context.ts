import * as assert from 'assert';
import {
  sendUnaryData as GrpcSendUnaryData,
  Metadata as GrpcMetadata,
  status as GrpcStatus,
  StatusObject as GrpcStatusObject,
} from 'grpc';

import { RpcApplication, GrpcServerCall } from './App';

export enum GrpcOpType {
  SEND_INITIAL_METADATA = 0,
  SEND_MESSAGE = 1,
  SEND_CLOSE_FROM_CLIENT = 2,
  SEND_STATUS_FROM_SERVER = 3,
  RECV_INITIAL_METADATA = 4,
  RECV_MESSAGE = 5,
  RECV_STATUS_ON_CLIENT = 6,
  RECV_CLOSE_ON_SERVER = 7,
}

export class RpcContext {

  public app: RpcApplication;
  public call: GrpcServerCall<any, any>;
  public callback: GrpcSendUnaryData<any>;

  constructor() {
  }

  /**
   * Handle error with gRPC status.
   * @see {@link https://github.com/grpc/grpc-node/blob/master/packages/grpc-native-core/src/server.js}
   * @param {Error} err
   */
  public onError(err: Error) {
    assert(err instanceof Error, `non-error thrown: ${err}`);

    let call = this.call;
    let statusMetadata = new GrpcMetadata();
    let status = {
      code: GrpcStatus.UNKNOWN,
      details: 'Unknown Error'
    } as GrpcStatusObject;

    if (err.hasOwnProperty('message')) {
      status.details = err.message;
    }
    if (err.hasOwnProperty('code')) {
      status.code = (err as any).code;
      if (err.hasOwnProperty('details')) {
        status.details = (err as any).details;
      }
    }
    if (err.hasOwnProperty('metadata')) {
      statusMetadata = (err as any).metadata;
    }

    status.metadata = (statusMetadata as any)._getCoreRepresentation();

    let errorBatch: { [index: number]: any } = {};
    if (!(call as any).metadataSent) {
      errorBatch[GrpcOpType.SEND_INITIAL_METADATA] = ((new GrpcMetadata() as any)._getCoreRepresentation());
    }
    errorBatch[GrpcOpType.SEND_STATUS_FROM_SERVER] = status;
    (call as any).startBatch(errorBatch, () => {
    });
  }

}