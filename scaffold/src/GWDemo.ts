import GWDemo from './sample/GWDemo';

const server = new GWDemo();
server.init(process.env.NODE_ENV === 'development')
    .then(() => {
        server.start();
    })
    .catch((err) => {
        console.log(err);
    });

process.on('unhandledRejection', function (reason, p) {
    console.log('Unhandled Rejection at:', p, 'reason:', reason);
});