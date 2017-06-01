import * as gRPC from 'grpc';

const messages = require('./proto/book_pb');
const services = require('./proto/book_grpc_pb');

function getBook(call, callback) {
    let reply = new messages.Book();
    reply.setTitle('Good Book');
    reply.setAuthor('Jonathan');
    console.log(call.request.getIsbn(), reply);
    callback(null, reply);
}

function main() {
    let server = new gRPC.Server();
    server.addService(services.BookServiceService, {getBook: getBook});
    server.bind('127.0.0.1:50051', gRPC.ServerCredentials.createInsecure());
    console.log('Listening on: 127.0.0.1:50051');
    server.start();
}
main();