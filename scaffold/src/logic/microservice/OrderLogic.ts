import {RpcContext} from 'sasdn';
import {GetOrderRequest, Order,} from '../../proto/order/order_pb';

export namespace OrderLogic {

    export async function getOrder(request: GetOrderRequest, ctx?: RpcContext): Promise<Order> {

        const order = new Order();
        order.setOrderid(request.getOrderid());
        order.setUserid('demoUserId');
        order.setPrice('2000');
        order.setIspayed(true);
        order.getItemsMap()
            .set(1, 'item4')
            .set(2, 'item5')
            .set(3, 'item6');
        // Some async logic maybe ...

        return Promise.resolve(order);

    }

}