import MSOrder from './sample/MSOrder';

const server = new MSOrder();
server.init(process.env.NODE_ENV === 'development')
    .then(() => {
        server.start();
    })
    .catch((err) => {
        console.log(err.message);
    });