import GatewayServer from "./sample/DemoGateway";

const server = new GatewayServer();
server.init(process.env.NODE_ENV === 'development')
    .then(() => {
        server.start();
    })
    .catch((err) => {
        console.log(err.message);
    });