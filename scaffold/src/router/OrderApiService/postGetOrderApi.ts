import {GatewayApiBase, GatewayContext, MiddlewareNext} from "sasdn";
import {Order, GetOrderRequest, } from "../../proto/order/order_pb";
import * as OrderService from "../../lib/OrderClientService";

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
                        required: true,
                    },
                },
            },
        };
    }

    public async handle(ctx: GatewayContext, next: MiddlewareNext, params: RequestParams): Promise<Order.AsObject> {
        try {
            const order = await OrderService.getOrder(ctx, next, params);
            return await order.toObject() ;
        } catch (e) {
            return e.toString();
        }
    }
}

export const api = new PostGetOrderApi();