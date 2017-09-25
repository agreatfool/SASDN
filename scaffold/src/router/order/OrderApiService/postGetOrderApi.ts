import {GatewayApiBase, GatewayContext, MiddlewareNext} from "sasdn";
import {Order, GetOrderRequest, } from "../../../proto/order/order_pb";

import {OrderLogic} from "../../../logic/gateway/OrderLogic";

interface RequestParams {
    body: GetOrderRequest.AsObject;
}

class PostGetOrderApi extends GatewayApiBase {
    constructor() {
        super();
        this.method = 'post';
        this.uri = '/v1/getOrder';
        this.type = 'application/json; charset=utf-8';
        this.schemaDefObj = {
            body: {
                type: 'object',
                required: true,
                schema: {
                    orderid: {
                        type: 'string',
                        required: false,
                    },
                },
            },
        };
    }

    public async handle(ctx: GatewayContext, next: MiddlewareNext, params: RequestParams): Promise<Order.AsObject> {
        try {
            const order = await OrderLogic.getOrder(ctx, next, params);
            return Promise.resolve(order.toObject());
        } catch (e) {
            return e.toString();
        }
    }
}

export const api = new PostGetOrderApi();