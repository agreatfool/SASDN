import MSOrder from './entrance/MSOrder';
import { Logger } from './lib/Logger';

const server = new MSOrder();
server.init(process.env.CONTAINER)
  .then(() => {
    server.start();
  })
  .catch((error) => {
    Logger.instance.error(`MicroService init failed error = ${error.stack}`);
  });

process.on('uncaughtException', (error) => {
  Logger.instance.error(`process on uncaughtException error = ${error.stack}`);
});

process.on('unhandledRejection', (error) => {
  Logger.instance.error(`process on unhandledRejection error = ${error.stack}`);
});

process.on('SIGINT', () => {
  if (server && server.app && server.app.server) {
    server.app.server.tryShutdown(() => {
      Logger.instance.warn('MSOrder shutdown by SIGINT');
    })
  }
  process.exit(0);
});