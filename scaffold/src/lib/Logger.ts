import { SendRequest, SendResponse } from '../proto/kafkaqueue/kafkaqueue_pb';
import MSKafkaqueueClient from '../clients/kafkaqueue/MSKafkaqueueClient';
import { Logger as SasdnLogger, LogOptions, KafkaOptions, LEVEL } from 'sasdn-log';

const debug = require('debug')('SASDN:Demo');

export enum TOPIC {
  SYSTEM = 'SystemTopic',
  BUSINESS = 'BusinessTopic',
  DATACENTER = 'DataCenterTopic',
}

export enum LogType {
  Kafka = 1, Syslog
}

class KafkaLogger extends SasdnLogger {
  async sendMessage(message: string, options?: KafkaOptions): Promise<boolean> {
    if (process.env.NODE_ENV !== 'development') {
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

export class Logger {
  private static _instance: Logger;
  private _initialized: boolean;
  private _logger: SasdnLogger;

  public static get instance(): Logger {
    if (Logger._instance === undefined) {
      Logger._instance = new Logger();
    }
    return Logger._instance;
  }

  private constructor() {
    this._initialized = false;
  }

  public async initalize(option: LogOptions, logType: LogType = LogType.Kafka): Promise<any> {
    switch (logType) {
      case LogType.Kafka:
        this._logger = new KafkaLogger(option);
        break;
      default:
        this._logger = new KafkaLogger(option);
    }
    this._initialized = true;

    return Promise.resolve();
  }

  private _log(message: string, level: LEVEL = LEVEL.INFO, options?: LogOptions): void {
    if (!this._initialized) {
      debug(`[Logger._log] message=${message}`);
      return;
    }
    this._logger.log(message, level, options);
  }

  public fatal(message: string, options?: LogOptions): void {
    this._log(message, LEVEL.FATAL, options);
  }

  public error(message: string, options?: LogOptions): void {
    this._log(message, LEVEL.ERROR, options);
  }

  public warn(message: string, options?: LogOptions): void {
    this._log(message, LEVEL.WARN, options);
  }

  public info(message: string, options?: LogOptions): void {
    this._log(message, LEVEL.INFO, options);
  }

  public debug(message: string, options?: LogOptions): void {
    this._log(message, LEVEL.DEBUG, options);
  }

  public verbose(message: string, options?: LogOptions): void {
    this._log(message, LEVEL.TRACE, options);
  }
}