import { joi } from 'sasdn';

export namespace PbJoi {
  export const vDouble = joi.extend((joi) => ({
    base: joi.number().greater(Number.MIN_SAFE_INTEGER).less(Number.MAX_SAFE_INTEGER),
    name: 'base'
  }));

  export const vFloat = vDouble;

  export const vInt32 = joi.extend((joi) => ({
    base: joi.number().integer().greater(Number.MIN_SAFE_INTEGER).less(Number.MAX_SAFE_INTEGER),
    name: 'base'
  }));

  export const vSint32 = vInt32;

  export const vSfixed32 = vInt32;

// todo int64 = long

  export const vInt64 = vInt32;

  export const vSint64 = vInt64;

  export const vSfixed64 = vInt64;

  export const vUint32 = joi.extend((joi) => ({
    base: joi.number().integer().positive().less(Number.MAX_SAFE_INTEGER),
    name: 'base'
  }));

  export const vFixed32 = vUint32;

  export const vUint64 = vUint32;

  export const vFixed64 = vUint64;
}