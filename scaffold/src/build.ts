import { ContainerEnv } from './constant/const';
import { Config } from './lib/Config';
import * as LibDotEnv from 'dotenv';
import { DatabaseFactory } from 'sasdn-database';
import { DatabaseOption } from './model/DatabaseOptions';

async function main(container: string = ContainerEnv.PM2): Promise<void> {
  if (container === ContainerEnv.PM2) {
    const loadEnv = LibDotEnv.config();
    if (loadEnv.error) {
      return Promise.reject(loadEnv.error);
    }
  }

  await Config.instance.initalize();

  await DatabaseFactory.instance.initialize(DatabaseOption.getOptions());

  process.exit(0);
}

main(process.env.CONTAINER).catch(err => console.log(err));
