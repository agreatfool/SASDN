import GWDemo from './entrance/GWDemo';
import { Logger } from './lib/Logger';


const server = new GWDemo();
server.init(process.env.NODE_ENV === 'development')
  .then(() => {
    server.start();
  })
  .catch((error) => {
    Logger.instance.error(`Gateway init failed error = ${error.stack}`);
  });

process.on('uncaughtException', (error) => {
  Logger.instance.error(`Process on uncaughtException error = ${error.stack}`);
});

process.on('unhandledRejection', (error) => {
  Logger.instance.error(`Process on unhandledRejection error = ${error.stack}`);
});