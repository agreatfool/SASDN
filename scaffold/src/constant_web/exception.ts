export const MODULE_NAME = 'DemoApp';      // self name
export const EXCEPTION_MAJOR = '3';     // 1 arch 2 service 3 application
export const EXCEPTION_MINOR = '001';   // service or application type
export const ERROR_CODE = {
  1: '[%m] Successful',
  2: '[%m] Database error! %s.',
  3: '[%m] Item already exists: %s',
  4: '[%m] Item not found',
  5: '[%m] Function cannot be used when table is sharded. %s',
  6: '[%m] Unknown Error, %s',
  7: '[%m] Unique key must be provided. %s',
  8: '[%m] affetcedRows must be 1. %s',

  101: '[%m] Params error! %s', // 参数错误
  102: '[%m] Game server access error. %s', // 服务器访问失败
  103: '[%m] Response params format error. %s', // 响应格式错误
  104: '[%m] Game server response with error message. %s',  // 服务器返回错误信息
  105: '[%m] You do not have permission to access this url.', // 你没有访问该 url 的权限
  106: '[%m] Authentication Error.', // 身份验证失败
  107: '[%m] User has logouted. %s', // 用户已经登出
  108: '[%m] System is disable. %s', // 系统禁用
  109: '[%m] User account has been frozen. %s', // 账号冻结作废
  110: '[%m] Application permission has been changed. %s', // 应用功能权限变更
  111: '[%m] User application permission has been changed. %s', // 账号功能权限变更
  112: '[%m] User game permission has been changed. %s', // 账号游戏权限变更
  113: '[%m] User group permission has been changed. %s', // 所属用户组功能权限变更
  114: '[%m] Unable to generate sign with params. %s', // 参数格式错误，无法生成签名
  121: '[%m] Api sign err! AppId not found. %s', // 验证签名错误！AppId 没有找到
  122: '[%m] Api sign err! srcString is empty! %s', // 验证签名错误！srcString 为空
  123: '[%m] Api sign err! %s', // 验证签名错误！
  124: '[%m] Unable to generate sign with params. %s', // 参数错误，无法生成 sign
};
