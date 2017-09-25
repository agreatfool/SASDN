import MSServer from './sample/DemoMSServer';

const server = new MSServer();
server.init(process.env.NODE_ENV === 'development')
    .then(() => {
        server.start();
    })
    .catch((err) => {
        console.log(err.message);
    });