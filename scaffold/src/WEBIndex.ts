import GWServer from './entrance/WebServer';
import { Logger } from './lib/Logger';

const server = new GWServer();
server.init(process.env.CONTAINER)
  .then(() => {
    server.start();
  })
  .catch((error) => {
    Logger.instance.error(`Web init failed error = ${error.stack}`);
  });

process.on('uncaughtException', (error) => {
  Logger.instance.error(`Process on uncaughtException error = ${error.stack}`);
});

process.on('unhandledRejection', (error) => {
  Logger.instance.error(`Process on unhandledRejection error = ${error.stack}`);
});

process.on('SIGINT', () => {
  Logger.instance.warn('Web shutdown by SIGINT');
  process.exit(0);
});
