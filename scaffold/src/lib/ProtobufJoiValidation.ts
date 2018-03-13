import { joi } from 'sasdn';

export const MAX_INT32_VALUE = 2147483647;
export const MIN_INT32_VALUE = -2147483648;

export namespace ProtobufJoiValidation {
  export const vDouble = joi.extend((joi) => ({
    base: joi.number().min(Number.MIN_SAFE_INTEGER).max(Number.MAX_SAFE_INTEGER),
    name: 'activate'
  }));

  export const vFloat = vDouble;

  export const vInt32 = joi.extend((joi) => ({
    base: joi.number().integer().min(MIN_INT32_VALUE).max(MAX_INT32_VALUE),
    name: 'activate'
  }));

  export const vSint32 = vInt32;

  export const vSfixed32 = vInt32;

// todo int64 = long

  export const vInt64 = joi.extend((joi) => ({
    base: joi.number().integer().min(Number.MIN_SAFE_INTEGER).max(Number.MAX_SAFE_INTEGER),
    name: 'activate'
  }));

  export const vSint64 = vInt64;

  export const vSfixed64 = vInt64;

  export const vUint32 = joi.extend((joi) => ({
    base: joi.number().integer().positive().max(MAX_INT32_VALUE).allow(0),
    name: 'activate'
  }));

  export const vFixed32 = vUint32;

  export const vUint64 = joi.extend((joi) => ({
    base: joi.number().integer().positive().max(Number.MAX_SAFE_INTEGER).allow(0),
    name: 'activate'
  }));

  export const vFixed64 = vUint64;

  export const vBool = joi.extend((joi) => ({
    base: joi.bool(),
    name: 'activate'
  }));

  export const vString = joi.extend((joi) => ({
    base: joi.string(),
    name: 'activate'
  }));
}
