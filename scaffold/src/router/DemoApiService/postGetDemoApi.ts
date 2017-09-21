import {GatewayApiBase, GatewayContext, MiddlewareNext} from "sasdn";
import {Demo, GetDemoRequest, } from "../../proto/demo_pb";

interface RequestParams {
    body: GetDemoRequest.AsObject;
}

class PostGetDemoApi extends GatewayApiBase {
    constructor() {
        super();
        this.method = 'post';
        this.uri = '/v1/getDemo';
        this.type = 'application/json; charset=utf-8';
        this.schemaDefObj = {
            body: {
                type: 'object',
                required: true,
                schema: {
                    id: {
                        type: 'string',
                        required: false,
                    },
                },
            },
        };
    }

    public async handle(ctx: GatewayContext, next: MiddlewareNext, params: RequestParams): Promise<Demo.AsObject> {
        return await new Demo().toObject();
    }
}

export const api = new PostGetDemoApi();