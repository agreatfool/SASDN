// package: order
// file: order/order.proto

/* tslint:disable */

import * as jspb from "google-protobuf";

export class Order extends jspb.Message { 
    getOrderId(): number;
    setOrderId(value: number): void;

    getUserId(): string;
    setUserId(value: string): void;

    getPrice(): string;
    setPrice(value: string): void;

    getIspayed(): boolean;
    setIspayed(value: boolean): void;


    getItemsMap(): jspb.Map<number, string>;
    clearItemsMap(): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Order.AsObject;
    static toObject(includeInstance: boolean, msg: Order): Order.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Order, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Order;
    static deserializeBinaryFromReader(message: Order, reader: jspb.BinaryReader): Order;
}

export namespace Order {
    export type AsObject = {
        orderId: number,
        userId: string,
        price: string,
        ispayed: boolean,

        itemsMap: Array<[number, string]>,
    }
}

export class GetOrderRequest extends jspb.Message { 
    getOrderId(): number;
    setOrderId(value: number): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetOrderRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetOrderRequest): GetOrderRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetOrderRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetOrderRequest;
    static deserializeBinaryFromReader(message: GetOrderRequest, reader: jspb.BinaryReader): GetOrderRequest;
}

export namespace GetOrderRequest {
    export type AsObject = {
        orderId: number,
    }
}
