import { Context as KoaContext, Middleware as KoaMiddleware } from 'koa';
import * as unless from 'koa-unless';
import * as koa_convert from 'koa-convert';
import { CacheKeys, LOGOUT_TYPE_ERROR_MAP, LogoutType, PERMISSION_PATH_MAP } from '../constant/const';
import { Cache } from '../lib/Cache';
import { Exception } from '../lib/Exception';

export interface CustomMiddleware extends KoaMiddleware {
  unless?(params?: any): any;
}

export interface JwtUserInfo {
  userId: number;
  userName: string;
  permissionAliasNameList: string;
  iat: number;
  exp: number;
}

export namespace PermissionVerify {
  export function createMiddleware(): CustomMiddleware {
    const mymid: CustomMiddleware = async (ctx: KoaContext, next: () => Promise<any>) => {
      const userInfo: JwtUserInfo = ctx.state.user;
      // 验证用户是否被强制踢下线
      const userState = await Cache.memGet(`${CacheKeys.USER_LOGOUT_STATE}${userInfo.userId}`);
      if (!userState) {
        throw new Exception(107, `userId=${userInfo.userId}`);
      } else if (userState !== LogoutType.LOGIN) {
        throw new Exception(LOGOUT_TYPE_ERROR_MAP[userState], `userId=${userInfo.userId}`);
      }
      // 验证用户是否具有调用该 url 的权限
      const permissionAliasNameList: string[] = JSON.parse(userInfo.permissionAliasNameList);
      const pathList = [].concat(...permissionAliasNameList.map(item => PERMISSION_PATH_MAP[item]));
      pathList.push('/v1/common/logout');
      if (pathList.indexOf(ctx.path) === -1) {
        throw new Exception(105);
      } else {
        await next();
      }
    };

    mymid.unless = koa_convert(unless);
    return mymid;
  }
}
