import * as grpc from "grpc";

import {BookServiceClient} from "./proto/book_grpc_pb";
import {Book, GetBookRequest, GetBookViaAuthor} from "./proto/book_pb";
import {Duplex, Readable, Writable} from "stream";

let client = new BookServiceClient('127.0.0.1:50051', grpc.credentials.createInsecure());

function getBook() {
    let request = new GetBookRequest();
    request.setIsbn(1402894627);

    client.getBook(request, function (err, response: Book) {
        console.log('getBook response:', response.toObject());
    });
}

function getBooksViaAuthor() {
    let request = new GetBookViaAuthor();
    request.setAuthor('SpecifiedAuthor');

    let call = client.getBooksViaAuthor(request) as Readable;
    call.on('data', function (response: Book) {
        console.log('getBooksViaAuthor:', response.toObject());
    });
    call.on('end', function () {
        console.log('getBooksViaAuthor done.')
    });
}

function getGreatestBook() {
    let call = client.getGreatestBook((error, response: Book) => {
        console.log('getGreatestBook done:', response.toObject());
    }) as Writable;
    for (let i = 1; i <= 10; i++) {
        let request = new GetBookRequest();
        request.setIsbn(i);
        call.write(request);
    }
    call.end();
}

function getBooks() {
    let call = client.getBooks() as Duplex;
    call.on('data', function (response: Book) {
        console.log('getBooks:', response.toObject());
    });
    call.on('end', function () {
        console.log('getBooks done.');
    });

    for (let i = 1; i <= 10; i++) {
        let request = new GetBookRequest();
        request.setIsbn(i);
        call.write(request);
    }
    call.end();
}

function main() {
    // getBook();
    // getBooksViaAuthor();
    // getGreatestBook();
    getBooks();
}
main();