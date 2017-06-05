// package: com.book
// file: book.proto

import * as book_pb from "./book_pb";
export class BookService {
  static serviceName = "com.book.BookService";
}
export namespace BookService {
  export class GetBook {
    static readonly methodName = "GetBook";
    static readonly service = BookService;
    static readonly requestStream = false;
    static readonly responseStream = false;
    static readonly requestType = book_pb.GetBookRequest;
    static readonly responseType = book_pb.Book;
  }
}
