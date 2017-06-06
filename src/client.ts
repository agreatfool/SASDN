import * as gRPC from 'grpc';

import {BookServiceClient} from "./proto/book_grpc_pb";
import {Book, GetBookRequest} from "./proto/book_pb";

function main() {
    let client = new BookServiceClient('127.0.0.1:50051', gRPC.credentials.createInsecure());

    let request = new GetBookRequest();
    request.setIsbn(1402894627);

    client.getBook(request, function(err, response: Book) {
        console.log('Response:', response, response.getAuthor());
    });
}
main();