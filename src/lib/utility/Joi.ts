import * as joi from 'joi';
import * as bluebird from 'bluebird';

let joiValidate = bluebird.promisify(joi.validate) as {
  <T>(value: Object, schema: Object, options: joi.ValidationOptions): bluebird<T>
};

const pbDoubleJoi = joi.extend((joi) => ({
  base: joi.number().greater(Number.MIN_SAFE_INTEGER).less(Number.MAX_SAFE_INTEGER),
  name: 'base'
}));

const pbFloatJoi = pbDoubleJoi;

const pbInt32Joi = joi.extend((joi) => ({
  base: joi.number().integer().greater(Number.MIN_SAFE_INTEGER).less(Number.MAX_SAFE_INTEGER),
  name: 'base'
}));

const pbSint32Joi = pbInt32Joi;

const pbSfixed32Joi = pbInt32Joi;

// todo int64 = long

const pbInt64Joi = pbInt32Joi;

const pbSint64Joi = pbInt64Joi;

const pbSfixed64Joi = pbInt64Joi;

const pbUint32Joi = joi.extend((joi) => ({
  base: joi.number().integer().positive().less(Number.MAX_SAFE_INTEGER),
  name: 'base'
}));

const pbFixed32Joi = pbUint32Joi;

const pbUint64Joi = pbUint32Joi;

const pbFixed64Joi = pbUint64Joi;

export { joi, joiValidate, pbDoubleJoi, pbFloatJoi, pbInt32Joi, pbSint32Joi, pbSfixed32Joi, pbInt64Joi,
  pbSint64Joi, pbSfixed64Joi, pbUint32Joi, pbFixed32Joi, pbUint64Joi, pbFixed64Joi };