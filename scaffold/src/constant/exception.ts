export const MODULE_NAME = 'Demo';      // self name
export const EXCEPTION_MAJOR = '2';     // 1 arch 2 service 3 application
export const EXCEPTION_MINOR = '001';   // service or application type
export const ERROR_CODE = {
  1: '[%m] Successful',
  2: '[%m] Database error! %s.',
  3: '[%m] Item already exists: %s',
  4: '[%m] Item not found',
  5: '[%m] Function cannot be used when table is sharded. %s',
  6: '[%m] Unknown Error, %s',
  7: '[%m] Unique key must be provided. %s',
  8: '[%m] [affetcedRows] must be 1. %s',

  101: '[%m] Some Error',
};
