import MSOrder from './entrance/MSOrder';

const debug = require('debug')('SASDN:MSDemo');

const server = new MSOrder();
server.init(process.env.NODE_ENV === 'development')
  .then(() => {
    server.start();
  })
  .catch((err) => {
    debug(`MicroService init failed error = ${err}`);
  });

process.on('uncaughtException', (error) => {
  debug(`process on uncaughtException error = ${error}`);
});

process.on('unhandledRejection', (error) => {
  debug(`process on unhandledRejection error = ${error}`);
});