// package: demo
// file: demo/demo.proto

import * as jspb from "google-protobuf";
import * as order_order_pb from "../order/order_pb";

export class GetDemoOrderRequest extends jspb.Message { 
    getOrderId(): number;
    setOrderId(value: number): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetDemoOrderRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetDemoOrderRequest): GetDemoOrderRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetDemoOrderRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetDemoOrderRequest;
    static deserializeBinaryFromReader(message: GetDemoOrderRequest, reader: jspb.BinaryReader): GetDemoOrderRequest;
}

export namespace GetDemoOrderRequest {
    export type AsObject = {
        orderId: number,
    }
}
