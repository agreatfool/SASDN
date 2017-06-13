import * as grpc from "grpc";

import {Book, GetBookRequest, GetBookViaAuthor} from "../proto/book_pb";
import {BookServiceService as BookService} from "../proto/book_grpc_pb";
import {Readable} from "stream";

function getBook(call, callback) {
    let request = call.request as GetBookRequest;
    console.log('getBook request:', request.toObject());
    let reply = new Book();
    reply.setTitle('DefaultBook');
    reply.setAuthor('DefaultAuthor');
    reply.setIsbn(request.getIsbn());
    callback(null, reply);
}

function getBooksViaAuthor(call) {
    let request = call.request as GetBookViaAuthor;
    console.log('getBooksViaAuthor request:', request.toObject());
    for (let i = 1; i <= 10; i++) {
        let reply = new Book();
        reply.setTitle(`Book${i}`);
        reply.setAuthor(request.getAuthor());
        reply.setIsbn(i);
        call.write(reply);
    }
    call.end();
}

function getGreatestBook(call: Readable, callback) {
    let lastOne: GetBookRequest;
    call.on('data', function (request: GetBookRequest) {
        console.log('getGreatestBook:', request.toObject());
        lastOne = request;
    });
    call.on('end', function () {
        let reply = new Book();
        reply.setIsbn(lastOne.getIsbn());
        reply.setTitle('LastOne');
        reply.setAuthor('LastOne');
        console.log('getGreatestBook done:', reply.toObject());
        callback(null, reply);
    });
}

function getBooks(call) {
    call.on('data', function (request: GetBookRequest) {
        console.log('getBooks:', request.toObject());
        let reply = new Book();
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
    server.addService(BookService, {
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