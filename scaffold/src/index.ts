import HttpServer from "./demoGatewayServer";

const httpServer = new HttpServer();
httpServer.init(process.env.NODE_ENV == 'development')
    .then(() => {
        httpServer.start();
    })
    .catch((err) => {
        console.log(err.message);
    });