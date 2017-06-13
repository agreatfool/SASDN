"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grpc = require("grpc");
const book_grpc_pb_1 = require("../proto/book_grpc_pb");
const book_pb_1 = require("../proto/book_pb");
let client = new book_grpc_pb_1.BookServiceClient('127.0.0.1:50051', grpc.credentials.createInsecure());
function getBook() {
    let request = new book_pb_1.GetBookRequest();
    request.setIsbn(1402894627);
    client.getBook(request, function (err, response) {
        console.log('getBook response:', response.toObject());
    });
}
function getBooksViaAuthor() {
    let request = new book_pb_1.GetBookViaAuthor();
    request.setAuthor('SpecifiedAuthor');
    let call = client.getBooksViaAuthor(request);
    call.on('data', function (response) {
        console.log('getBooksViaAuthor:', response.toObject());
    });
    call.on('end', function () {
        console.log('getBooksViaAuthor done.');
    });
}
function getGreatestBook() {
    let call = client.getGreatestBook((error, response) => {
        console.log('getGreatestBook done:', response.toObject());
    });
    for (let i = 1; i <= 10; i++) {
        let request = new book_pb_1.GetBookRequest();
        request.setIsbn(i);
        call.write(request);
    }
    call.end();
}
function getBooks() {
    let call = client.getBooks();
    call.on('data', function (response) {
        console.log('getBooks:', response.toObject());
    });
    call.on('end', function () {
        console.log('getBooks done.');
    });
    for (let i = 1; i <= 10; i++) {
        let request = new book_pb_1.GetBookRequest();
        request.setIsbn(i);
        call.write(request);
    }
    call.end();
}
function main() {
    // getBook();
    getBooksViaAuthor();
    // getGreatestBook();
    // getBooks();
}
main();
//# sourceMappingURL=client.js.map