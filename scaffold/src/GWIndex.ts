import GWDemo from './entrance/GWDemo';

const debug = require('debug')('SASDN:GWDemo');

const server = new GWDemo();
server.init(process.env.NODE_ENV === 'development')
  .then(() => {
    server.start();
  })
  .catch((err) => {
    debug(`Gateway init failed error = ${err}`);
  });

process.on('uncaughtException', (error) => {
  debug(`process on uncaughtException error = ${error}`);
});

process.on('unhandledRejection', (error) => {
  debug(`process on unhandledRejection error = ${error}`);
});