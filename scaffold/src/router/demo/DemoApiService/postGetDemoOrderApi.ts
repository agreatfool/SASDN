import {GatewayApiBase, GatewayContext, MiddlewareNext} from "sasdn";
import {Order, } from "../../../proto/order/order_pb";
import {GetDemoOrderRequest, } from "../../../proto/demo/demo_pb";
import {OrderLogic} from "../../../logic/gateway/OrderLogic";

interface RequestParams {
    body: GetDemoOrderRequest.AsObject;
}

class PostGetDemoOrderApi extends GatewayApiBase {
    constructor() {
        super();
        this.method = 'post';
        this.uri = '/v1/getDemoOrder';
        this.type = 'application/json; charset=utf-8';
        this.schemaDefObj = {
            body: {
                type: 'object',
                required: true,
                schema: {
                    order_id: {
                        type: 'string',
                        required: false,
                    },
                },
            },
        };
    }

    public async handle(ctx: GatewayContext, next: MiddlewareNext, params: RequestParams): Promise<Order.AsObject> {
        console.log(`[Gateway] /v1/getDemoOrder, params: ${JSON.stringify(params)}`);
        let orderObj = (await OrderLogic.getOrder(ctx, next, params)).toObject();
        console.log(`[Gateway] /v1/getDemoOrder, response: ${JSON.stringify(orderObj)}`);

        return Promise.resolve(orderObj);
    }
}

export const api = new PostGetDemoOrderApi();