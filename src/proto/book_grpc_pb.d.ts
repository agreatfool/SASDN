// package: com.book
// file: book.proto

import * as grpc from 'grpc';
import * as book_pb from "./book_pb";

const serialize_com_book_GetBookRequest = function (arg: book_pb.GetBookRequest) {
    return new Buffer(arg.serializeBinary());
};

const deserialize_com_book_GetBookRequest = function (buffer_arg: Uint8Array) {
    return book_pb.GetBookRequest.deserializeBinary(new Uint8Array(buffer_arg));
};

const serialize_com_book_Book = function (arg: book_pb.Book) {
    return new Buffer(arg.serializeBinary());
};

const deserialize_com_book_Book = function (buffer_arg: Uint8Array) {
    return book_pb.Book.deserializeBinary(new Uint8Array(buffer_arg));
};

export const BookServiceService = {
    getBook: {
        path: '/com.book.BookService/GetBook',
        requestStream: false,
        responseStream: false,
        requestType: book_pb.GetBookRequest,
        responseType: book_pb.Book,
        requestSerialize: serialize_com_book_GetBookRequest,
        requestDeserialize: deserialize_com_book_GetBookRequest,
        responseSerialize: serialize_com_book_Book,
        responseDeserialize: deserialize_com_book_Book,
    },
};

export const BookServiceClient = grpc.makeGenericClientConstructor(BookServiceService);