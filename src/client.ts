import * as gRPC from 'grpc';

const messages = require('./proto/book_pb');
const services = require('./proto/book_grpc_pb');

function main() {
    let client = new services.BookServiceClient('127.0.0.1:50051', gRPC.credentials.createInsecure());

    let request = new messages.GetBookRequest();
    request.setIsbn(1402894627);

    client.getBook(request, function(err, response) {
        console.log('Response:', response);
    });
}
main();