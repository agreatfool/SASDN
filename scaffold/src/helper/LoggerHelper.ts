import { SendRequest, SendResponse } from '../proto/kafkaqueue/kafkaqueue_pb';
import MSKafkaqueueClient from '../clients/kafkaqueue/MSKafkaqueueClient';
import { Logger, KafkaOptions } from 'sasdn-log';

export enum TOPIC {
  SYSTEM = 'SystemTopic',
  BUSINESS = 'BusinessTopic',
  DATACENTER = 'DataCenterTopic',
}

class KafkaLogger extends Logger {
  async sendMessage(message: string, options?: KafkaOptions): Promise<boolean> {
    if(process.env.NODE_ENV !== 'development') {
      const client = new MSKafkaqueueClient();
      const request = new SendRequest();
      let response: SendResponse;
      request.setTopic(options.kafkaTopic || TOPIC.BUSINESS);
      request.setMessagesList([message]);
      try {
        response = await client.send(request);
        return response.getResult();
      }
      catch (error) {
        return false;
      }
    }
    return true;
  }
}

export class LoggerHelper {
  private static _instance: LoggerHelper;
  private _initialized: boolean;
  private _logger: KafkaLogger;

  public static get instance(): LoggerHelper {
    if (LoggerHelper._instance === undefined) {
      LoggerHelper._instance = new LoggerHelper();
    }
    return LoggerHelper._instance;
  }

  private constructor() {
    this._initialized = false;
  }

  public async initalize(option: KafkaOptions): Promise<any> {
    this._logger = new KafkaLogger(option);
    this._initialized = true;

    return Promise.resolve();
  }

  public get logger(): KafkaLogger {
    return this._logger;
  }
}