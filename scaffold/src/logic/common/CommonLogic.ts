import {
  LoginData,
  LoginReq,
  LoginRes,
  LogoutReq,
  LogoutRes,
  UploadingUrl,
  UploadingUrlGetReq,
  UploadingUrlGetRes,
  UserKickOffReq,
  UserKickOffRes,
} from '../../proto/web_common/web_common_pb';
import { GatewayContext, MiddlewareNext } from 'sasdn';
import { GenApiSign } from '../../lib/GenApiSign';
import { APP_ID, CacheKeys, JWT_SECRET, LogoutType, SEVEN_DAY_EXPIRE } from '../../constant/const';
import { Gateway, GatewayUser, GatewayApiClient } from '../../lib/GatewayApiClient';
import { HttpRequest } from '../../lib/HttpRequest';
import * as jwt from 'jsonwebtoken';
import { Config, ConfigConst } from '../../lib/Config';
import { Cache, MemcachedObject } from '../../lib/Cache';
import { JwtUserInfo } from '../../middleware/PermissionVerifyMiddleware';

export interface GatewayLoginOrRegisterResponseWithCookie extends  GatewayUser.GatewayLoginOrRegisterResponse {
  cookies?: string[];
}

export namespace CommonLogic {
  export async function login(ctx: GatewayContext, next?: MiddlewareNext, params?: any): Promise<LoginRes> {
    let body = params.body as LoginReq.AsObject;
    // 调用 api-gateway 的 login 接口
    let szLoginReq: GatewayUser.GatewayLoginRequest = {
      appId: APP_ID,
      userName: body.userName,
      password: body.password,
      timestamp: body.timestamp,
      sign: '',
    };
    szLoginReq.sign = GenApiSign.genApiSign(szLoginReq);
    let szLoginRes: GatewayLoginOrRegisterResponseWithCookie = await GatewayApiClient.userApiLogin(szLoginReq, HttpRequest.post);

    // 设置 cookie（兼容 api-gateway)
    let cookies: string[] = szLoginRes.cookies;
    for (let cookie of cookies) {
      let [cookieKey, cookieValue] = cookie.split(';')[0].split('=');
      ctx.cookies.set(cookieKey, cookieValue, { domain: Config.instance.getConfig(ConfigConst.COOKIE_DOMAIN) });
      ctx.set('Access-Control-Origin', ctx.header.origin);
    }

    // 根据登录接口返回的信息调用 api-gateway 的 checkST 接口，获取用户权限，并过滤
    let szCheckStReq: GatewayUser.GatewayCheckSTRequest = {
      appId: APP_ID,
      appSt: szLoginRes.data.appSt,
      timestamp: body.timestamp,
      sign: '',
    };
    szCheckStReq.sign = GenApiSign.genApiSign(szCheckStReq);
    let szCheckStRes: GatewayUser.GatewayCheckSTResponse = await GatewayApiClient.userApiCheckST(szCheckStReq, HttpRequest.post);
    let permissionAliasNameList = szCheckStRes.data.userAppPermission.permissionList.map(perm => perm.permissionAliasName);

    // 生成 JWT，七天后过期，用户需要重新登录
    let jwtObj = {
      userId: szLoginRes.data.userId,
      userName: szLoginRes.data.userName,
      permissionAliasNameList: JSON.stringify(permissionAliasNameList),
    };
    let jwtToken = jwt.sign(jwtObj, JWT_SECRET, { expiresIn: SEVEN_DAY_EXPIRE });

    // 缓存用户信息，七天后过期，用户需要重新登录
    await Cache.memSet({
      key: `${CacheKeys.USER_LOGOUT_STATE}${szLoginRes.data.userId}`,
      value: LogoutType.LOGIN,
      expire: SEVEN_DAY_EXPIRE,
    });

    let res = new LoginRes();
    let loginData = new LoginData();
    loginData.setUserId(szLoginRes.data.userId);
    loginData.setUserName(szLoginRes.data.userName);
    loginData.setDisplayName(szLoginRes.data.displayName);
    loginData.setPermissionAliasNameList(JSON.stringify(permissionAliasNameList));
    loginData.setJwt(jwtToken);
    res.setData(loginData);
    res.setCode(1);

    return res;
  }

  export async function logout(ctx: GatewayContext, next?: MiddlewareNext, params?: any): Promise<LogoutRes> {
    let body = params.body as LogoutReq.AsObject;
    // 调用 api-gateway 的 logout 接口
    let szLogoutReq: GatewayUser.GatewayUserLogoutRequest = {
      appId: APP_ID,
      timestamp: body.timestamp,
      sign: '',
    };
    szLogoutReq.sign = GenApiSign.genApiSign(szLogoutReq);
    let headers = {
      'Content-Type': 'application/json',
    };
    if (ctx.cookies.get('CAS_TGC')) {
      headers['cookie'] = `CAS_TGC=${ctx.cookies.get('CAS_TGC')}`;
    }
    await GatewayApiClient.userApiLogout(szLogoutReq, HttpRequest.post, {
      credentials: 'include',
      headers: headers,
    });
    ctx.cookies.set('CAS_TGC', '', { domain: Config.instance.getConfig(ConfigConst.COOKIE_DOMAIN) });
    ctx.set('Access-Control-Allow-Origin', ctx.header.origin);

    // 删除缓存的用户信息
    const userInfo: JwtUserInfo = ctx.state.user;
    if (userInfo) {
      await Cache.memDel(`${CacheKeys.USER_LOGOUT_STATE}${userInfo.userId}`);
    }

    let res = new LogoutRes();
    res.setCode(1);

    return res;
  }

  export async function getUploadingUrl(ctx: GatewayContext, next?: MiddlewareNext, params?: any): Promise<UploadingUrlGetRes> {
    let body = params.body as UploadingUrlGetReq.AsObject;
    // 调用 api-gateway 的 /v1/file/getUploadingUrl 接口
    let szGetUploadingUrlReq: Gateway.GatewayGetUploadingUrlReq = {
      appId: APP_ID,
      timestamp: body.timestamp,
      fileName: body.fileName,
      fileType: 1,
      sign: '',
    };
    szGetUploadingUrlReq.sign = GenApiSign.genApiSign(szGetUploadingUrlReq);
    let szRes: Gateway.GatewayGetUploadingUrlRes = await GatewayApiClient.getUploadingUrl(szGetUploadingUrlReq, HttpRequest.post);
    let uploadingUrl = szRes.data;

    let res = new UploadingUrlGetRes();
    res.setCode(1);
    let urlData = new UploadingUrl();
    urlData.setUploadingUrl(uploadingUrl);
    res.setData(urlData);

    return res;
  }

  export async function kickOffUser(ctx: GatewayContext, next?: MiddlewareNext, params?: any): Promise<UserKickOffRes> {
    let body = params.body as UserKickOffReq.AsObject;

    let setObjs: MemcachedObject[] = [];
    body.userIdList.map(userId => setObjs.push({
      key: `${CacheKeys.USER_LOGOUT_STATE}${userId}`,
      value: String(body.type),
    }));
    await Cache.memSetMulti(setObjs);

    let res = new UserKickOffRes();
    res.setCode(1);

    return res;
  }
}
