export const ExceptionName = 'Demo';       // self name
export const ExceptionMajor = '2';     // 1 arch 2 service 3 application
export const ExceptionMinor = '001';   // service or application type
export const ErrorCode = {
  1: '[%m] Successful',
  2: '[%m] Database error! %s.',
  3: '[%m] Item already exists: %s',
  4: '[%m] Item not found',
  5: '[%m] Function cannot be used when table is sharded. %s',

  101: '[%m] Some Error',

  10001: '[%m] Error: %s.',
};
