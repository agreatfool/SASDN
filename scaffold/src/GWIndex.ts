import GWDemo from './entrance/GWDemo';
import { Logger } from './lib/Logger';


const server = new GWDemo();
server.init(process.env.NODE_ENV === 'development')
  .then(() => {
    server.start();
  })
  .catch((err) => {
    Logger.instance.error(`Gateway init failed error = ${err}`);
  });

process.on('uncaughtException', (error) => {
  Logger.instance.error(`process on uncaughtException error = ${error}`);
});

process.on('unhandledRejection', (error) => {
  Logger.instance.error(`process on unhandledRejection error = ${error}`);
});