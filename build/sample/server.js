"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grpc = require("grpc");
const book_pb_1 = require("../proto/book_pb");
const book_grpc_pb_1 = require("../proto/book_grpc_pb");
function getBook(call, callback) {
    let request = call.request;
    console.log('getBook request:', request.toObject());
    let reply = new book_pb_1.Book();
    reply.setTitle('DefaultBook');
    reply.setAuthor('DefaultAuthor');
    reply.setIsbn(request.getIsbn());
    callback(null, reply);
}
function getBooksViaAuthor(call) {
    let request = call.request;
    console.log('getBooksViaAuthor request:', request.toObject());
    for (let i = 1; i <= 10; i++) {
        let reply = new book_pb_1.Book();
        reply.setTitle(`Book${i}`);
        reply.setAuthor(request.getAuthor());
        reply.setIsbn(i);
        call.write(reply);
    }
    call.end();
}
function getGreatestBook(call, callback) {
    let lastOne;
    call.on('data', function (request) {
        console.log('getGreatestBook:', request.toObject());
        lastOne = request;
    });
    call.on('end', function () {
        let reply = new book_pb_1.Book();
        reply.setIsbn(lastOne.getIsbn());
        reply.setTitle('LastOne');
        reply.setAuthor('LastOne');
        console.log('getGreatestBook done:', reply.toObject());
        callback(null, reply);
    });
}
function getBooks(call) {
    call.on('data', function (request) {
        console.log('getBooks:', request.toObject());
        let reply = new book_pb_1.Book();
        reply.setTitle(`Book${request.getIsbn()}`);
        reply.setAuthor(`Author${request.getIsbn()}`);
        reply.setIsbn(request.getIsbn());
        call.write(reply);
    });
    call.on('end', function () {
        console.log('getBooks done.');
        call.end();
    });
}
function main() {
    let server = new grpc.Server();
    server.addService(book_grpc_pb_1.BookServiceService, {
        getBook: getBook,
        getBooksViaAuthor: getBooksViaAuthor,
        getGreatestBook: getGreatestBook,
        getBooks: getBooks
    });
    server.bind('127.0.0.1:50051', grpc.ServerCredentials.createInsecure());
    console.log('Listening on: 127.0.0.1:50051');
    server.start();
}
main();
//# sourceMappingURL=server.js.map