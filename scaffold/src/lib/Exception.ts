import { ErrorCode, ModuleName, ExceptionMajor, ExceptionMinor } from '../constant/exception';

type ParamsType = string | number | Array<string | number>;
type ParamsTypes = Array<ParamsType>;

export class Exception extends Error {
  public name: string;
  public code: number;
  public message: string;

  public constructor(code: number, params: ParamsType | ParamsTypes = null, moduleName ?: string) {
    super();
    this.code = code;
    this.message = Exception.getExtMsg(code, params, moduleName);
  }

  public static getExtMsg(code: number, params: ParamsType | ParamsTypes = null, moduleName ?: string) {

    let message: string;
    if (ErrorCode.hasOwnProperty(code)) {
      message = ErrorCode[code];
    } else {
      message = `[%m]ErrorCode does not exist, Code:${code}.`;
    }

    // replace module name
    message = message.replace('%m', (moduleName) ? moduleName : ModuleName);

    // replace params
    if (params != null) {
      if (typeof params !== 'object') {
        params = [params];
      }

      for (let i in params as Array<any>) {
        message = message.replace('%s', params[i].toString());
      }
    }

    const formatCode = `000${code}`;
    const realCode = formatCode.substr(formatCode.length - 3);
    let result = JSON.stringify({
      code: `${ExceptionMajor}${ExceptionMinor}${realCode}`,
      message: message,
    });

    // add message length
    let len = message.length;
    let trueLen = Exception.getRealLen(message);
    for (let i = 0; i < trueLen - len; i++) {
      result += '  ';
    }
    return result;
  }

  public static parseErrorMsg(err: Error) {
    try {
      return JSON.parse(err.message);
    } catch (e) {
      return Exception.parseErrorMsg(new Exception(6, err.message));
    }
  }

  public static getRealLen(str) {
    return str.replace(/[^\x00-\xff]/g, '__').length;
  }
}
