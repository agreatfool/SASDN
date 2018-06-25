export const APP_ID = 3001;
export const JWT_SECRET = 'f9630041f472dfedc66d909efce647d5';
export const SEVEN_DAY_EXPIRE = 86400 * 7;

// 权限和 path 配置，从 permissionOptions.json 配置文件中读取
const permissionOptions = require('../../permissionOptions.json');
/**
 * 不需要检查用户权限，所有人都能调用的接口配置，示例如下：
 * {
      "path": [
        "/v1/getDemoOrder",
        "/v1/common/login",
        "/v1/common/getUploadingUrl",
        "/common"
      ]
   }
 */
export const UNLESS_OPTIONS = permissionOptions.unlessOptions;
/**
 * 权限和 path 映射关系，示例如下：
 * {
      "advManage": [
        "/v1/game/edit"
      ],
      "guestbookManage": [
        "/v1/msg/getList",
        "/v1/msg/getDetail",
        "/v1/msg/changeState"
      ],
      "jobManage": [
        "/v1/job/createOrEdit",
        "/v1/job/changeState"
      ],
      "newsManage": [
        "/v1/news/createOrEdit",
        "/v1/news/changeState",
        "/v1/news/check",
        "/v1/news/setTop",
        "/v1/news/setShuffling"
      ]
    }
 */
export const PERMISSION_PATH_MAP = permissionOptions.permissionPathMap;
// 需要验签的 path 列表
export const NEED_CHECK_SIGN_PATH_LIST = permissionOptions.needCheckSignPathList;

export const enum ContainerEnv {
  K8S = 'Kubernetes',
  PM2 = 'Pm2',
}

export const enum LogoutType {
  LOGIN = '1',  // 登录中
  DISABLE_APP = '2', // 系统禁用
  DISABLE_USER = '3', // 账号冻结作废
  ALTER_APP_FUNC = '4', // 应用功能权限变更
  ALTER_USER = '5', // 账号功能权限变更
  ALTER_USER_GAME = '6', // 账号游戏权限变更
  ALTER_USER_GROUP = '7', // 所属用户组功能权限变更
}

export const LOGOUT_TYPE_ERROR_MAP = {
  [LogoutType.DISABLE_APP]: 108,
  [LogoutType.DISABLE_USER]: 109,
  [LogoutType.ALTER_APP_FUNC]: 110,
  [LogoutType.ALTER_USER]: 111,
  [LogoutType.ALTER_USER_GAME]: 112,
  [LogoutType.ALTER_USER_GROUP]: 113,
};

export const enum CacheKeys {
  USER_LOGOUT_STATE = '3001ULS:',
}
