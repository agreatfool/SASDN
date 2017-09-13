import GrpcServer from "./demoMicorServer";

const grpcServer = new GrpcServer();
grpcServer.init(process.env.NODE_ENV == 'development')
    .then(() => {
        grpcServer.start();
    })
    .catch((err) => {
        console.log(err.message);
    });