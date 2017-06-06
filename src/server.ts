import * as gRPC from 'grpc';
import {Book} from "./proto/book_pb";
import {BookServiceService as BookService} from "./proto/book_grpc_pb";

function getBook(call, callback) {
    let reply = new Book();
    reply.setTitle('Good Book');
    reply.setAuthor('Jonathan');
    console.log(call.request.getIsbn(), reply);
    callback(null, reply);
}

function main() {
    let server = new gRPC.Server();
    server.addService(BookService, {getBook: getBook});
    server.bind('127.0.0.1:50051', gRPC.ServerCredentials.createInsecure());
    console.log('Listening on: 127.0.0.1:50051');
    server.start();
}
main();