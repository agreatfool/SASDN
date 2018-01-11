import { ErrorCode, ExceptionName, ExceptionMajor, ExceptionMinor } from '../constant/exception';

type ParamsType = string | number | Array<string | number>;

export class Exception extends Error {
  public name: string;
  public code: number;
  public message: string;

  public constructor(code: number, params: ParamsType | ParamsType[] = null, exceptionName ?: string) {
    super();
    this.code = code;
    this.message = this.getExtMsg(code, params, exceptionName);
  }

  public getExtMsg(code: number, params: ParamsType | ParamsType[] = null, exceptionName ?: string) {

    let message: string;
    if (ErrorCode.hasOwnProperty(code)) {
      message = ErrorCode[code];
    } else {
      message = `[%m]ErrorCode does not exist, Code:${code}.`;
    }

    // replace module name
    message = message.replace('%m', (exceptionName) ? exceptionName : ExceptionName);

    // replace params
    if (params != null) {
      if (typeof params != 'object') {
        params = [params];
      }

      for (let i in params as Array<any>) {
        message = message.replace('%s', params[i].toString());
      }
    }

    const formatCode = `000${code}`;
    const realCode = code === 10001 ? 10001 : formatCode.substr(formatCode.length - 3);
    return JSON.stringify({
      code: `${ExceptionMajor}${ExceptionMinor}${realCode}`,
      message: message
    });
  }

  public static parseErrorMsg(err: Error) {
    try {
      return JSON.parse(err.message);
    } catch (e) {
      return Exception.parseErrorMsg(new Exception(10001, err.message));
    }
  }
}
