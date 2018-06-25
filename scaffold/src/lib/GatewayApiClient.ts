import { RetryOptions } from './HttpRequest';

export interface ReqOptions {
  method?: 'GET' | 'POST' | 'DELETE' | 'PATCH' | 'PUT' | 'HEAD' | 'OPTIONS' | 'CONNECT';
  headers?: Object;
  body?: string;
  mode?: 'cors' | 'no-cors' | 'same-origin';
  credentials?: 'omit' | 'same-origin' | 'include';
  cache?: 'default' | 'no-store' | 'reload' | 'no-cache' | 'force-cache' | 'only-if-cached';
  redirect?: 'follow' | 'error' | 'manual';
  referrer?: string;
  referrerPolicy?: 'referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'unsafe-url';
  integrity?: any;
  timeout?: number;
  retryOptions?: RetryOptions;
}

export namespace Gateway{ 

  export interface GatewayDataCollectionRequest {
    appId: number;
    logMessageList: Gateway.LogMessageData[];
    timestamp: number;
    sign: string;
  }

  export interface LogMessageData {
    gameId: number;
    areaId: number;
    uid: string;
    time: number;
    cash: number;
    coin: number;
    level: number;
    rtime: number;
    token: string;
    ip: string;
    item?: string;
    uuid: string;
    act: string;
    value: number;
    value2: number;
    tid?: string;
  }

  export interface GatewayDataCollectionResponse {
    code: number;
    message: string;
  }

  export interface GatewayGetUploadingUrlReq {
    appId: number;
    timestamp: number;
    sign: string;
    fileType: number;
    fileName: string;
  }

  export interface GatewayGetUploadingUrlRes {
    code: number;
    message: string;
    data: string;
  }

  export interface GatewayGetDownloadingUrlReq {
    appId: number;
    timestamp: number;
    sign: string;
    fileKey: string;
  }

  export interface GatewayGetDownloadingUrlRes {
    code: number;
    message: string;
    data: string;
  }
}

export namespace GatewayGame{ 

  export interface GatewayGameLoginRequest {
    cpId: number;
    appId: number;
    accountType: number;
    thirdPartyId?: string;
    accessToken?: string;
    extra?: GatewayGame.ExtraType;
    channelCode: string;
    fcmToken?: string;
    language?: string;
    timestamp: number;
    sign: string;
  }

  export interface ExtraType {
    guid?: number;
    appId?: number;
    accountType?: number;
    thirdPartyId?: string;
    accessToken?: string;
  }

  export interface GatewayGameLoginResponse {
    code: number;
    message: string;
    data: Game.GameLoginResponse;
  }

  export interface GatewayGameBindAccountRequest {
    cpId: number;
    appId: number;
    guid: number;
    accountType: number;
    thirdPartyId: string;
    accessToken: string;
    extra?: GatewayGame.ExtraType;
    timestamp: number;
    sign: string;
  }

  export interface GatewayGameBindAccountResponse {
    code: number;
    message: string;
    data: Game.GameBindAccountResponse;
  }

  export interface GatewayGameCheckSessionRequest {
    cpId: number;
    appId: number;
    guid: number;
    sessionId: string;
    timestamp: number;
    sign: string;
  }

  export interface GatewayGameCheckSessionResponse {
    code: number;
    message: string;
    data: GatewayGame.GameCheckSessionData;
  }

  export interface GameCheckSessionData {
    guid: number;
  }

  export interface GatewayGameUpdateFCMRequest {
    appId: number;
    guid: number;
    fcmToken?: string;
    language?: string;
    timestamp: number;
    sign: string;
  }

  export interface GatewayGameUpdateFCMResponse {
    code: number;
    message: string;
  }
}

export namespace Game{ 

  export interface GameLoginResponse {
    guid: number;
    sessionId: string;
    bindList: Game.GameBindData[];
  }

  export interface GameBindData {
    guid: number;
    appId: number;
    accountType: number;
    thirdPartyId: string;
    thirdPartyNickname: string;
    bindTime: number;
  }

  export interface GameBindAccountResponse {
    guid: number;
    bindList: Game.GameBindData[];
  }

  export interface GameInfoEmailData {
    bindEmail: string;
    accountType: number;
    nickname: string;
  }
}

export namespace GatewayGmtool{ 

  export interface GatewayGameServerListGetReq {
    appId: number;
    timestamp: number;
    sign: string;
    gameAppId: number;
    operatorId: number;
  }

  export interface GatewayGameServerListGetRes {
    code: number;
    message: string;
    data: Gmtool.GMToolGameServerListGetRes;
  }

  export interface GatewayGameServerStateChangeReq {
    appId: number;
    timestamp: number;
    sign: string;
    gameAppId: number;
    gameServCode: string;
    gameServState: number;
    operatorId: number;
  }

  export interface GatewayGameServerStateChangeRes {
    code: number;
    message: string;
  }

  export interface GatewayChannelListGetReq {
    appId: number;
    timestamp: number;
    sign: string;
    gameAppId: number;
    operatorId: number;
  }

  export interface GatewayChannelListGetRes {
    code: number;
    message: string;
    data: Permission.PermissionChannelListGetRes;
  }

  export interface GatewayItemListGetReq {
    appId: number;
    timestamp: number;
    sign: string;
    gameAppId: number;
    operatorId: number;
    itemCodeList: string[];
  }

  export interface GatewayItemListGetRes {
    code: number;
    message: string;
    data: Gmtool.GMToolItemListGetRes;
  }

  export interface GatewayFunctionListGetReq {
    appId: number;
    timestamp: number;
    sign: string;
    gameAppId: number;
    filterFuncName?: string;
    filterFuncCode?: string;
    filterServerCode?: string;
    filterChannelCode?: string;
    operatorId: number;
    start: number;
    limit: number;
  }

  export interface GatewayFunctionListGetRes {
    code: number;
    message: string;
    data: Gmtool.GMToolFunctionListGetRes;
  }

  export interface GatewayFunctionCreateReq {
    appId: number;
    timestamp: number;
    sign: string;
    gameAppId: number;
    functionName: string;
    functionCode: string;
    functionDesc?: string;
    defaultState: number;
    serverCodeList: string[];
    channelCodeList: string[];
    operatorId: number;
  }

  export interface GatewayFunctionCreateRes {
    code: number;
    message: string;
  }

  export interface GatewayFunctionEditReq {
    appId: number;
    timestamp: number;
    sign: string;
    gameAppId: number;
    functionId: number;
    functionName: string;
    functionCode: string;
    functionDesc?: string;
    defaultState: number;
    serverCodeList: string[];
    channelCodeList: string[];
    operatorId: number;
  }

  export interface GatewayFunctionEditRes {
    code: number;
    message: string;
  }

  export interface GatewayFunctionGetReq {
    appId: number;
    timestamp: number;
    sign: string;
    gameAppId: number;
  }

  export interface GatewayFunctionGetRes {
    code: number;
    message: string;
    data: Gmtool.GMToolFunctionGetRes;
  }

  export interface GatewayFunctionStateChangeReq {
    appId: number;
    timestamp: number;
    sign: string;
    gameAppId: number;
    functionId: number;
    state: number;
    operatorId: number;
  }

  export interface GatewayFunctionStateChangeRes {
    code: number;
    message: string;
  }

  export interface GatewayGameListGetReq {
    appId: number;
    timestamp: number;
    sign: string;
    filterType: number;
    filterValue: string;
    operatorId: number;
  }

  export interface GatewayGameListGetRes {
    code: number;
    message: string;
    data: Permission.PermissionGameListGetRes;
  }

  export interface GatewayGiftPackageBatchCreateReq {
    appId: number;
    timestamp: number;
    sign: string;
    gameAppId: number;
    packageName: string;
    packageType: number;
    activationCodeNum?: number;
    activationCode?: string;
    startTime: number;
    endTime: number;
    itemList: Gmtool.GMToolItem[];
    serverCodeList: string[];
    operatorId: number;
  }

  export interface GatewayGiftPackageBatchCreateRes {
    code: number;
    message: string;
  }

  export interface GatewayGiftPackageBatchUpdateReq {
    appId: number;
    timestamp: number;
    sign: string;
    gameAppId: number;
    packageBatchId: number;
    packageName: string;
    activationCode?: string;
    startTime: number;
    endTime: number;
    itemList: Gmtool.GMToolItem[];
    serverCodeList: string[];
    operatorId: number;
  }

  export interface GatewayGiftPackageBatchUpdateRes {
    code: number;
    message: string;
  }

  export interface GatewayGiftPackageBatchListGetReq {
    appId: number;
    timestamp: number;
    sign: string;
    gameAppId: number;
    filterPackageName?: string;
    filterGameServCode?: string;
    operatorId: number;
    start: number;
    limit: number;
  }

  export interface GatewayGiftPackageBatchListGetRes {
    code: number;
    message: string;
    data: Gmtool.GMToolGiftPackageBatchListGetRes;
  }

  export interface GatewayGiftPackageBatchStateChangeReq {
    appId: number;
    timestamp: number;
    sign: string;
    gameAppId: number;
    packageBatchId: number;
    state: number;
    operatorId: number;
  }

  export interface GatewayGiftPackageBatchStateChangeRes {
    code: number;
    message: string;
  }

  export interface GatewayActivationCodeAddReq {
    appId: number;
    timestamp: number;
    sign: string;
    gameAppId: number;
    packageBatchId: number;
    count: number;
    operatorId: number;
  }

  export interface GatewayActivationCodeAddRes {
    code: number;
    message: string;
  }

  export interface GatewayActivationCodeExportReq {
    appId: number;
    timestamp: number;
    sign: string;
    gameAppId: number;
    packageBatchId: number;
    operatorId: number;
    publishChannel: string;
  }

  export interface GatewayActivationCodeExportRes {
    code: number;
    message: string;
    data: Gmtool.GMToolActivationCodeExportRes;
  }

  export interface GatewayActivationCodeUseReq {
    appId: number;
    timestamp: number;
    sign: string;
    gameAppId: number;
    activationCode: string;
    gameUserId: string;
    gameServCode: string;
  }

  export interface GatewayActivationCodeUseRes {
    code: number;
    message: string;
    data: Gmtool.GMToolActivationCodeUseRes;
  }

  export interface GatewayPublishTypeListGetReq {
    appId: number;
    timestamp: number;
    sign: string;
    gameAppId: number;
    operatorId: number;
    start?: number;
    limit?: number;
  }

  export interface GatewayPublishTypeListGetRes {
    code: number;
    message: string;
    data: Gmtool.GMToolPublishTypeListGetRes;
  }

  export interface GatewayPublishTypeAddReq {
    appId: number;
    timestamp: number;
    sign: string;
    gameAppId: number;
    publishName: string;
    publishCode: number;
    desc: string;
    config: Gmtool.GMToolPublishConfigs;
    operatorId: number;
  }

  export interface GatewayPublishTypeAddRes {
    code: number;
    message: string;
    data: Gmtool.GMToolPublishTypeAddRes;
  }

  export interface GatewayPublishTypeEditReq {
    appId: number;
    timestamp: number;
    sign: string;
    gameAppId: number;
    publishId: number;
    operationType: number;
    publishName: string;
    publishCode: number;
    desc: string;
    config: Gmtool.GMToolPublishConfigs;
    operatorId: number;
  }

  export interface GatewayPublishTypeEditRes {
    code: number;
    message: string;
    data: Gmtool.GMToolPublishTypeEditRes;
  }

  export interface GatewayPublishTypeStateChangeReq {
    appId: number;
    timestamp: number;
    sign: string;
    gameAppId: number;
    publishId: number;
    operationType: number;
    operatorId: number;
  }

  export interface GatewayPublishTypeStateChangeRes {
    code: number;
    message: string;
    data: Gmtool.GMToolPublishTypeStateChangeRes;
  }

  export interface GatewayLanguageListGetReq {
    appId: number;
    timestamp: number;
    sign: string;
    gameAppId: number;
    operatorId: number;
  }

  export interface GatewayLanguageListGetRes {
    code: number;
    message: string;
    data: Gmtool.GMToolLanguageListGetRes;
  }

  export interface GatewayLanguageStateChangeReq {
    appId: number;
    timestamp: number;
    sign: string;
    gameAppId: number;
    languageUsedList: number[];
    operatorId: number;
  }

  export interface GatewayLanguageStateChangeRes {
    code: number;
    message: string;
  }

  export interface GatewayMsgTmplListGetReq {
    appId: number;
    timestamp: number;
    sign: string;
    gameAppId: number;
    publishId?: number;
    operatorId: number;
    start?: number;
    limit?: number;
  }

  export interface GatewayMsgTmplListGetRes {
    code: number;
    message: string;
    data: Gmtool.GMToolMsgTmplListGetRes;
  }

  export interface GatewayMsgTmplAddReq {
    appId: number;
    timestamp: number;
    sign: string;
    gameAppId: number;
    templateName: string;
    operatorId: number;
    publishId: number;
    templateContent: Gmtool.GMToolMsgTmplContent;
  }

  export interface GatewayMsgTmplAddRes {
    code: number;
    message: string;
    data: Gmtool.GMToolMsgTmplAddRes;
  }

  export interface GatewayMsgTmplEditReq {
    appId: number;
    timestamp: number;
    sign: string;
    gameAppId: number;
    templateId: number;
    templateContent: Gmtool.GMToolMsgTmplContent;
    operatorId: number;
  }

  export interface GatewayMsgTmplEditRes {
    code: number;
    message: string;
    data: Gmtool.GMToolMsgTmplEditRes;
  }

  export interface GatewayMsgTmplDelReq {
    appId: number;
    timestamp: number;
    sign: string;
    gameAppId: number;
    templateId: number;
    operatorId: number;
  }

  export interface GatewayMsgTmplDelRes {
    code: number;
    message: string;
    data: Gmtool.GMToolMsgTmplDelRes;
  }

  export interface GatewayPlayersModelListGetReq {
    appId: number;
    timestamp: number;
    sign: string;
    operatorId: number;
    start: number;
    limit: number;
  }

  export interface GatewayPlayersModelListGetRes {
    code: number;
    message: string;
    data: Gmtool.GMToolPlayersModelListGetRes;
  }

  export interface GatewayPlayersModelAddReq {
    appId: number;
    timestamp: number;
    sign: string;
    modelName: string;
    modelCode: string;
    desc?: string;
    operatorId: number;
  }

  export interface GatewayPlayersModelAddRes {
    code: number;
    message: string;
    data: Gmtool.GMToolPlayersModelAddRes;
  }

  export interface GatewayPlayersModelEditReq {
    appId: number;
    timestamp: number;
    sign: string;
    modelId: number;
    modelName: string;
    modelCode: string;
    desc?: string;
    operatorId: number;
  }

  export interface GatewayPlayersModelEditRes {
    code: number;
    message: string;
    data: Gmtool.GMToolPlayersModelEditRes;
  }

  export interface GatewayPlayersModelDelReq {
    appId: number;
    timestamp: number;
    sign: string;
    modelId: number;
    operatorId: number;
  }

  export interface GatewayPlayersModelDelRes {
    code: number;
    message: string;
    data: Gmtool.GMToolPlayersModelDelRes;
  }

  export interface GatewayCalculationTaskCompleteReq {
    appId: number;
    timestamp: number;
    sign: string;
    messageId: number;
    jobId: number;
    count: number;
    calcSrc: number;
  }

  export interface GatewayCalculationTaskCompleteRes {
    code: number;
    message: string;
  }

  export interface GatewayGameWhiteListGetReq {
    appId: number;
    timestamp: number;
    sign: string;
    gameAppId: number;
    operatorId: number;
  }

  export interface GatewayGameWhiteListGetRes {
    code: number;
    message: string;
    data: Gmtool.GMToolGameWhiteListGetRes;
  }

  export interface GatewayUsersToGameWhiteListAddReq {
    appId: number;
    timestamp: number;
    sign: string;
    gameAppId: number;
    ipList: Gmtool.GMToolGameWhiteListData[];
    operatorId: number;
  }

  export interface GatewayUsersToGameWhiteListAddRes {
    code: number;
    message: string;
  }

  export interface GatewayUsersFromGameWhiteListRemoveReq {
    appId: number;
    timestamp: number;
    sign: string;
    gameAppId: number;
    ipList: Gmtool.GMToolGameWhiteListData[];
    operatorId: number;
  }

  export interface GatewayUsersFromGameWhiteListRemoveRes {
    code: number;
    message: string;
  }

  export interface GatewayMsgCreateReq {
    appId: number;
    timestamp: number;
    sign: string;
    gameAppId: number;
    messageName: string;
    publishCode: number;
    templateId?: number;
    receiveType: number;
    intervalDay?: number;
    startTime: number;
    endTime?: number;
    isGlobalSync: number;
    messageBodyList: Gmtool.GMToolMsgBody[];
    msgDetailUrl?: string;
    itemCodeList?: Gmtool.GMToolItem[];
    gameServCodeList?: string[];
    channelCodeList?: string[];
    playerModelInfo?: Gmtool.GMToolPlayerModelInfo;
    operatorId: number;
  }

  export interface GatewayMsgCreateRes {
    code: number;
    message: string;
  }

  export interface GatewayMsgEditReq {
    appId: number;
    timestamp: number;
    sign: string;
    messageId: number;
    gameAppId: number;
    messageName?: string;
    publishCode?: number;
    templateId?: number;
    receiveType?: number;
    intervalDay?: number;
    startTime?: number;
    endTime?: number;
    isGlobalSync?: number;
    messageBodyList?: Gmtool.GMToolMsgBody[];
    msgDetailUrl?: string;
    itemCodeList?: Gmtool.GMToolItem[];
    gameServCodeList?: string[];
    channelCodeList?: string[];
    playerModelInfo?: Gmtool.GMToolPlayerModelInfo;
    operatorId: number;
  }

  export interface GatewayMsgEditRes {
    code: number;
    message: string;
  }

  export interface GatewayMsgStateChangeReq {
    appId: number;
    timestamp: number;
    sign: string;
    messageId: number;
    messageState: number;
    operatorId: number;
  }

  export interface GatewayMsgStateChangeRes {
    code: number;
    message: string;
  }

  export interface GatewayMsgListGetReq {
    appId: number;
    timestamp: number;
    sign: string;
    filterMessageName?: string;
    filterPublishCode?: number;
    filterGameServCode?: string;
    filterChannelCode?: string;
    start: number;
    limit: number;
    operatorId?: number;
    gameAppId: number;
  }

  export interface GatewayMsgListGetRes {
    code: number;
    message: string;
    data: Gmtool.GMToolMsgListGetRes;
  }

  export interface GatewayMsgGetReq {
    appId: number;
    timestamp: number;
    sign: string;
    messageId: number;
    operatorId?: number;
  }

  export interface GatewayMsgGetRes {
    code: number;
    message: string;
    data: Gmtool.GMToolMsgGetRes;
  }

  export interface GatewayMsgPublishReq {
    appId: number;
    timestamp: number;
    sign: string;
    messageId: number;
    operatorId: number;
  }

  export interface GatewayMsgPublishRes {
    code: number;
    message: string;
  }

  export interface GatewayAnnounceGetReq {
    appId: number;
    timestamp: number;
    sign: string;
    gameAppId?: number;
    sourceType: number;
    channelCode: string;
    languageId: number;
    timeOffset: number;
  }

  export interface GatewayAnnounceGetRes {
    code: number;
    message: string;
    data: Gmtool.GMToolAnnounceGetRes;
  }

  export interface GatewayGameEventCreateReq {
    appId: number;
    timestamp: number;
    sign: string;
    gameAppId: number;
    eventCode: string;
    eventName: string;
    startTime: number;
    endTime?: number;
    eventType: number;
    operatorId: number;
    period?: number;
    lastingTime?: number;
    rewards?: string;
    serverCodeList?: string;
    templateId?: number;
  }

  export interface GatewayGameEventCreateRes {
    code: number;
    message: string;
  }

  export interface GatewayGameEventEditReq {
    appId: number;
    timestamp: number;
    sign: string;
    eventId: number;
    gameAppId: number;
    eventCode: string;
    eventName: string;
    startTime: number;
    endTime?: number;
    eventType: number;
    operatorId: number;
    period?: number;
    lastingTime?: number;
    rewards: string;
    serverCodeList?: string;
    templateId?: number;
  }

  export interface GatewayGameEventEditRes {
    code: number;
    message: string;
  }

  export interface GatewayGameEventStateChangeReq {
    appId: number;
    timestamp: number;
    sign: string;
    eventId: number;
    state: number;
    operatorId: number;
  }

  export interface GatewayGameEventStateChangeRes {
    code: number;
    message: string;
  }

  export interface GatewayGameEventListGetReq {
    appId: number;
    timestamp: number;
    sign: string;
    gameAppId: number;
    filterEventName?: string;
    filterServerCode?: string;
    start: number;
    limit: number;
  }

  export interface GatewayGameEventListGetRes {
    code: number;
    message: string;
    data: Gmtool.GMToolGameEventListGetRes;
  }

  export interface GatewayGameEventDetailGetReq {
    appId: number;
    timestamp: number;
    sign: string;
    eventId: number;
  }

  export interface GatewayGameEventDetailGetRes {
    code: number;
    message: string;
    data: Gmtool.GMToolGameEventDetailGetRes;
  }

  export interface GatewayGameEventTmplAddReq {
    appId: number;
    timestamp: number;
    sign: string;
    gameAppId: number;
    templateName: string;
    templateContent: Gmtool.GMToolEventTmplContent;
    operatorId: number;
  }

  export interface GatewayGameEventTmplAddRes {
    code: number;
    message: string;
  }

  export interface GatewayGameEventTmplEditReq {
    appId: number;
    timestamp: number;
    sign: string;
    gameAppId: number;
    templateId: number;
    templateContent: Gmtool.GMToolEventTmplContent;
    operatorId: number;
  }

  export interface GatewayGameEventTmplEditRes {
    code: number;
    message: string;
  }

  export interface GatewayGameEventTmplDelReq {
    appId: number;
    timestamp: number;
    sign: string;
    gameAppId: number;
    templateId: number;
    operatorId: number;
  }

  export interface GatewayGameEventTmplDelRes {
    code: number;
    message: string;
  }

  export interface GatewayGameEventTmplListGetReq {
    appId: number;
    timestamp: number;
    sign: string;
    gameAppId: number;
    start: number;
    limit: number;
  }

  export interface GatewayGameEventTmplListGetRes {
    code: number;
    message: string;
    data: Gmtool.GMToolGameEventTmplListGetRes;
  }

  export interface GatewayGameUserListGetReq {
    appId: number;
    timestamp: number;
    sign: string;
    gameAppId: number;
    gameUserId?: string;
    gameUserName?: string;
    bindEmail?: string;
    gameServerCode?: string;
    gameServerName?: string;
    start: number;
    limit: number;
  }

  export interface GatewayGameUserListGetRes {
    code: number;
    message: string;
    data: Gmtool.GMToolGameUserListGetRes;
  }

  export interface GatewayGameUserGetReq {
    appId: number;
    timestamp: number;
    sign: string;
    gameAppId: number;
    gameUserId: string;
    gameServerCode: string;
    userId: number;
  }

  export interface GatewayGameUserGetRes {
    code: number;
    message: string;
    data: Gmtool.GMToolGameUserGetRes;
  }

  export interface GatewayChangeGameUserStateReq {
    appId: number;
    timestamp: number;
    sign: string;
    gameAppId: number;
    gameUserId: string;
    gameServerCode: string;
    gameUserState: number;
    operateId: string;
    gameUserRemark: string;
    gameUserFreezeType?: number;
    gameUserFreezeTime?: number;
  }

  export interface GatewayChangeGameUserStateRes {
    code: number;
    message: string;
  }
}

export namespace Gmtool{ 

  export interface GMToolGameServerListGetRes {
    gameServList: Gmtool.GMToolGameServer[];
  }

  export interface GMToolGameServer {
    gameServCode: string;
    gameServName: string;
    gameServState: number;
  }

  export interface GMToolItemListGetRes {
    itemList: Gmtool.GMToolItemDetail[];
  }

  export interface GMToolItemDetail {
    itemName: string;
    itemCode: string;
    itemPrice: string;
    itemCurrency: string;
  }

  export interface GMToolFunctionListGetRes {
    functionList: Gmtool.GMToolFunction[];
    count: number;
  }

  export interface GMToolFunction {
    gameAppId: number;
    functionId: number;
    functionName: string;
    functionCode: string;
    functionDesc: string;
    defaultState: number;
    state: number;
    serverCodeList: string[];
    channelCodeList: string[];
  }

  export interface GMToolFunctionGetRes {
    functionInfoList: Gmtool.GMToolFunctionInfo[];
  }

  export interface GMToolFunctionInfo {
    functionCode: string;
    functionState: number;
    functionDefaultState: number;
    channelCodeList: string[];
    gameServCodeList: string[];
  }

  export interface GMToolItem {
    itemCode: string;
    itemNum: number;
  }

  export interface GMToolGiftPackageBatchListGetRes {
    giftPackageList: Gmtool.GMToolGiftPackageBatch[];
    count: number;
  }

  export interface GMToolGiftPackageBatch {
    gameAppId: number;
    packageBatchId: number;
    packageBatchCode: string;
    packageName: string;
    packageType: number;
    activationCode: string;
    startTime: number;
    endTime: number;
    itemList: Gmtool.GMToolItem[];
    serverCodeList: string[];
    totalNumber: number;
    usedNumber: number;
    state: number;
    publishTime: number;
    publishChannel: string;
  }

  export interface GMToolActivationCodeExportRes {
    activationCodes: string;
  }

  export interface GMToolActivationCodeUseRes {
    itemList: Gmtool.GMToolItem[];
    packageName: string;
  }

  export interface GMToolPublishTypeListGetRes {
    publishTypeList: Gmtool.GMToolPublishType[];
    count: number;
  }

  export interface GMToolPublishType {
    publishId: number;
    publishName: string;
    publishCode: number;
    desc: string;
    config: Gmtool.GMToolPublishConfigs;
    state: number;
    operationType: number;
  }

  export interface GMToolPublishConfigs {
    receiveOnce: number;
    partServer: number;
    allowTitle: number;
    partChannel: number;
    getGift: number;
    otherWay: number;
    clickLink: number;
    supportImg: number;
  }

  export interface GMToolPublishTypeAddRes {
  }

  export interface GMToolPublishTypeEditRes {
  }

  export interface GMToolPublishTypeStateChangeRes {
  }

  export interface GMToolLanguageListGetRes {
    languageUsedList: number[];
  }

  export interface GMToolMsgTmplListGetRes {
    messageTemplateList: Gmtool.GMToolMsgTmplData[];
    count: number;
  }

  export interface GMToolMsgTmplData {
    templateId: number;
    templateName: string;
    operatorId: number;
    publishId: number;
    publishName: string;
    templateContent: Gmtool.GMToolMsgTmplContent;
    updateTime: number;
    operator: User.UserGetResponse;
  }

  export interface GMToolMsgTmplContent {
    receiveType?: number;
    intervalDay?: number;
    isGlobalSync?: number;
    messageBodyList: Gmtool.GMToolMsgBody[];
    messageDetailUrl?: string;
    itemCodeList?: Gmtool.GMToolItem[];
    gameServCodeList?: string[];
    channelCodeList?: string[];
    playersModelCode?: string;
    playersModelArgsList?: number[];
  }

  export interface GMToolMsgBody {
    languageId?: number;
    title?: string;
    content?: string;
  }

  export interface GMToolMsgTmplAddRes {
  }

  export interface GMToolMsgTmplEditRes {
  }

  export interface GMToolMsgTmplDelRes {
  }

  export interface GMToolPlayersModelListGetRes {
    playersModelList: Gmtool.GMToolPlayersModel[];
    count: number;
  }

  export interface GMToolPlayersModel {
    modelId: number;
    modelName: string;
    modelCode: string;
    desc: string;
  }

  export interface GMToolPlayersModelAddRes {
  }

  export interface GMToolPlayersModelEditRes {
  }

  export interface GMToolPlayersModelDelRes {
  }

  export interface GMToolGameWhiteListGetRes {
    ipList: Gmtool.GMToolGameWhiteListData[];
  }

  export interface GMToolGameWhiteListData {
    ip: string;
    remark: string;
  }

  export interface GMToolPlayerModelInfo {
    playerModelType: number;
    playerModelCode: string;
    playerModelArgs: string;
    playerUidList: string[];
    fileName: string;
    fileKey: string;
  }

  export interface GMToolMsgListGetRes {
    count: number;
    messageDataList: Gmtool.GMToolMsgGetRes[];
  }

  export interface GMToolMsgGetRes {
    messageId: number;
    appId: number;
    creatorId: number;
    messageName: string;
    publishCode: number;
    templateId: number;
    receiveType: number;
    intervalDay: number;
    startTime: number;
    endTime: number;
    isGlobalSync: number;
    messageBodyList: Gmtool.GMToolMsgBody[];
    msgDetailUrl: string;
    itemCodeList: Gmtool.GMToolItem[];
    gameServCodeList: string[];
    channelCodeList: string[];
    latestEditorId: number;
    createTime: number;
    updateTime: number;
    playerModelInfo: Gmtool.GMToolPlayerModelInfo;
    operatorId: number;
    messageState: number;
    creatorDisplayName: string;
    latestEditorDisplayName: string;
  }

  export interface GMToolAnnounceGetRes {
    annList: Gmtool.GMToolAnnounce[];
  }

  export interface GMToolAnnounce {
    messageName: string;
    startTime: number;
    endTime: number;
    isGlobalSync: number;
    messageBodyList: Gmtool.GMToolMsgBody[];
    msgDetailUrl: string;
    receiveType: number;
    intervalDay: number;
    messageId: number;
  }

  export interface GMToolGameEventListGetRes {
    count: number;
    gameEventList: Gmtool.GMToolGameEventBasicInfo[];
  }

  export interface GMToolGameEventBasicInfo {
    eventId: number;
    appId: number;
    eventCode: string;
    eventName: string;
    state: number;
    startTime: number;
    endTime: number;
    serverCodeList: string;
    eventType: number;
  }

  export interface GMToolGameEventDetailGetRes {
    eventId: number;
    appId: number;
    eventCode: string;
    eventName: string;
    state: number;
    startTime: number;
    endTime: number;
    eventType: number;
    latestEditTime: number;
    latestEditorId: number;
    latestEditorDisplayName: string;
    firstStartTime: number;
    nextStartTime: number;
    period: number;
    lastingTime: number;
    activeCount: number;
    rewards: string;
    serverCodeList: string;
    templateId: number;
    createTime: number;
    updateTime: number;
  }

  export interface GMToolEventTmplContent {
    appId: number;
    eventCode: string;
    eventName: string;
    startTime: number;
    endTime: number;
    eventType: number;
    period: number;
    lastingTime: number;
    rewards: string;
    serverCodeList: string;
    templateId: number;
    templateName: string;
    latestEditorId: number;
    latestEditorDisplayName: string;
    updateTime: number;
  }

  export interface GMToolGameEventTmplListGetRes {
    count: number;
    templateContentList: Gmtool.GMToolEventTmplContent[];
  }

  export interface GMToolGameUserListGetRes {
    count: number;
    dataList: Gmtool.GMToolGameUserGetData[];
  }

  export interface GMToolGameUserGetData {
    userId: number;
    gameUserId: string;
    gameUserName: string;
    gameServerCode: string;
    gameServerName: string;
    bindEmailList: Game.GameInfoEmailData[];
  }

  export interface GMToolGameUserGetRes {
    gameUserId: string;
    gameUserName: string;
    gameServerCode: string;
    gameServerName: string;
    registerTime: string;
    register_IP: string;
    lastLoginTime: string;
    lastLogin_IP: string;
    gameUserData: string;
    gameUserStatus: number;
    userId: number;
    bindEmailList: Game.GameInfoEmailData[];
    gameUserFreezeType: number;
    gameUserFreezeToTime: string;
  }
}

export namespace Permission{ 

  export interface PermissionChannelListGetRes {
    channelList: Permission.PermissionChannel[];
  }

  export interface PermissionChannel {
    channelId: number;
    channelCode: string;
    channelName: string;
  }

  export interface PermissionGameListGetRes {
    gameList: Permission.PermissionGameInfo[];
  }

  export interface PermissionGameInfo {
    gameAppId: number;
    gameName: string;
    gameChannelName: string;
    callbackUrl: string;
  }

  export interface PermissionApplicationListByTypeData {
    appTypeDataList: Permission.PermissionApplicationTypeGroup[];
  }

  export interface PermissionApplicationTypeGroup {
    appType: number;
    appTypeName: string;
    appList: Permission.PermissionApplicationBrief[];
  }

  export interface PermissionApplicationBrief {
    appId: number;
    appType: number;
    appTypeName: string;
    appName: string;
  }

  export interface PermissionApplicationAddResponse {
    id: number;
    appPrivateKey: string;
  }

  export interface PermissionApplicationUpdateResponse {
    id: number;
  }

  export interface PermissionApplicationFunctionAddResponse {
    id: number;
  }

  export interface PermissionApplicationFunctionUpdateResponse {
    id: number;
  }

  export interface PermissionApplicationFunctionMoveResponse {
    id: number;
  }

  export interface PermissionApplicationFunctionEnableOrDisableResponse {
    id: number;
  }

  export interface PermissionApplicationEnableOrDisableResponse {
    id: number;
  }

  export interface PermissionApplicationUpdatePrivateKeyResponse {
    id: number;
    appPrivateKey: string;
  }

  export interface PermissionApplicationGetPrivateKeyResponse {
    id: number;
    appId: number;
    appPrivateKey: string;
  }

  export interface PermissionApplicationTypeGetResponse {
    typeList: Permission.PermissionApplicationTypeData[];
  }

  export interface PermissionApplicationTypeData {
    appTypeId: number;
    appTypeName: string;
  }

  export interface PermissionUserGroupDataList {
    count: number;
    userGroupList: Permission.PermissionUserGroupData[];
  }

  export interface PermissionUserGroupData {
    groupId: number;
    groupName: string;
    groupUserNum: number;
    creator: User.UserGetResponse;
    description: string;
    status: boolean;
    createTime: number;
    appId: number;
    appName: string;
  }

  export interface UserPermissionData {
    permissionId: number;
    permissionName: string;
    type: number;
    parentId: number;
    appId: number;
    creator: string;
    status: number;
    level: number;
    sort: number;
    createTime: number;
    permissionAliasName: string;
  }

  export interface UserGroupRelation {
    userIdList: number[];
    groupId: number;
  }

  export interface UserPermissionGetResponse {
    permissionList: Permission.UserPermissionData[];
  }
}

export namespace User{ 

  export interface UserGetResponse {
    userId: number;
    userName: string;
    level: number;
    userAvatar: string;
    userSex: boolean;
    userPosition: string;
    userEmail: string;
    userDepParty: string;
    gameType: number;
    type: number;
    status: number;
    createTime: number;
    updateTime: number;
    departmentId: number;
    displayName: string;
  }

  export interface AccountManagementUserListGetResponse {
    count: number;
    actMgmtUserList: User.AccountManagementUser[];
  }

  export interface AccountManagementUser {
    user: User.UserGetResponse;
    depPath: string;
    userStatus: number;
    createTime: number;
  }

  export interface UserGame4usUserInfo {
    nickName: string;
    avatar: string;
    sex: number;
    signature: string;
  }

  export interface UserCodeToEmailSendResponse {
    userId: number;
  }

  export interface UserEmailCodeCheckResponse {
    userName: string;
  }

  export interface UserPasswordForgetResponse {
  }

  export interface UserPasswordChangeResponse {
  }

  export interface UserGame4usUserInfoUpdateResponse {
  }

  export interface UserSecurityInfoGetResponse {
    bindMailStatus: number;
    email: string;
    pwdLevel: number;
    dataList: User.LoginLogData[];
    googleAccount: string;
    facebookAccount: string;
    googleAccountState: number;
    facebookAccountState: number;
  }

  export interface LoginLogData {
    appId: number;
    appName: string;
    updateTime: number;
  }

  export interface UserSecurityMailBindResponse {
  }

  export interface UserBindMailConfirmResponse {
  }

  export interface UserThirdAccountBindResponse {
  }

  export interface UserThirdAccountUnbindResponse {
  }
}

export namespace GatewayPayment{ 

  export interface GatewayPaymentCreateOrderRequest {
    appId: number;
    timestamp: number;
    sign: string;
    guid: number;
    gameRoleId: string;
    productId: string;
    productNum: number;
    productPrice: number;
    paymentMethod: number;
    paymentCurrency: string;
    paymentAmount: number;
    orderSource: string;
    areaId: number;
    extra?: string;
    playerDispName?: string;
    playerEmail?: string;
  }

  export interface GatewayPaymentCreateOrderResponse {
    code: number;
    message: string;
    data: Payment.PaymentCreateOrderResponse;
  }

  export interface GatewayPaymentQueryOrderListRequest {
    appId: number;
    sign: string;
    timestamp: number;
    gameAppId?: number;
    guid: number;
    filterPlayerDispName: string;
    filterAreaId: number;
    filterStartTime?: number;
    filterEndTime?: number;
    filterPlayerEmail: string;
    filterGameRoleId: string;
    start: number;
    limit: number;
    paymentMethod: number;
    operatorId: number;
    filterOrderId: number;
    queryMode: number;
  }

  export interface GatewayPaymentQueryOrderListResponse {
    code: number;
    message: string;
    data: Payment.PaymentQueryOrderListResponse;
  }

  export interface GatewayPaymentQueryOrderDetailRequest {
    appId: number;
    sign: string;
    timestamp: number;
    guid: number;
    orderId: number;
    gameAppId?: number;
    operatorId: number;
  }

  export interface GatewayPaymentQueryOrderDetailResponse {
    code: number;
    message: string;
    data: Payment.PaymentQueryOrderDetailResponse;
  }

  export interface GatewayPaymentRepairOrderRequest {
    appId: number;
    sign: string;
    timestamp: number;
    gameAppId?: number;
    orderId: number;
    operatorId: number;
    reason: string;
    operateJobId: number;
    outerOrderId: string;
  }

  export interface GatewayPaymentRepairOrderResponse {
    code: number;
    message: string;
  }

  export interface GatewayPaymentCheckOrderRequest {
    appId: number;
    orderId: number;
    extra: Payment.PaymentCallbackContent;
    timestamp: number;
    sign: string;
  }

  export interface GatewayPaymentCheckOrderResponse {
    code: number;
    message: string;
    data: Payment.PaymentCheckOrderResponse;
  }

  export interface GatewayPaymentCancelOrderRequest {
    appId: number;
    orderId: number;
    timestamp: number;
    sign: string;
  }

  export interface GatewayPaymentCancelOrderResponse {
    code: number;
    message: string;
  }
}

export namespace Payment{ 

  export interface PaymentCreateOrderResponse {
    orderId: number;
    orderStatus: number;
  }

  export interface PaymentQueryOrderListResponse {
    guid: number;
    count: number;
    orderDataList: Payment.PaymentOrderBaseData[];
  }

  export interface PaymentOrderBaseData {
    orderId: number;
    orderStatus: number;
    paymentMethod: number;
    content: Payment.PaymentCallbackContent;
    createTime: number;
    guid: number;
  }

  export interface PaymentCallbackContent {
    outerOrderId?: string;
    purchaseToken: string;
    productId: string;
    packageName?: string;
    realCurrency?: string;
    realAmount?: number;
    sandbox?: number;
    signature?: string;
  }

  export interface PaymentQueryOrderDetailResponse {
    orderId: number;
    orderStatus: number;
    orderForced: number;
    orderSource: string;
    appId: number;
    guid: number;
    gameRoleId: string;
    outerOrderId: string;
    productId: string;
    productNum: number;
    productPrice: number;
    paymentMethod: number;
    paymentCurrency: string;
    paymentAmount: number;
    realCurrency: string;
    realAmount: number;
    extra: string;
    createTime: number;
    updateTime: number;
    paymentTime: number;
    endTime: number;
    content: Payment.PaymentCallbackContent;
    callback_3rdResponse: string;
    callbackAppResponse: string;
    operationLogList: Payment.OrderOperationLog[];
    playerDisplayName: string;
    playerEmailList: string[];
    areaId: number;
  }

  export interface OrderOperationLog {
    orderId: number;
    operatorId: number;
    statusBeforeOperate: number;
    reason: string;
    operateJobId: number;
    createTime: number;
    updateTime: number;
    operatorName: string;
  }

  export interface PaymentCheckOrderResponse {
    orderId: number;
    orderStatus: number;
  }
}

export namespace GatewayPermission{ 

  export interface GatewayPermissionApplicationListGetRequest {
    appId: number;
    timestamp: number;
    sign: string;
    userId?: number;
  }

  export interface GatewayPermissionApplicationListGetResponse {
    code: number;
    message: string;
    data: GatewayPermission.GatewayPermissionApplicationListData;
  }

  export interface GatewayPermissionApplicationListData {
    appsList: GatewayPermission.GatewayPermissionApplicationData[];
  }

  export interface GatewayPermissionApplicationData {
    id: number;
    appId: number;
    appType: number;
    appTypeName: string;
    appGameType: number;
    appName: string;
    appAliasName: string;
    appUrl: string;
    appCallbackUrl: string;
    appStatus: boolean;
    appCheck: boolean;
    groupId: number;
    userList: GatewayPermission.GatewayPermissionUserData[];
  }

  export interface GatewayPermissionUserData {
    userName: string;
    userInfo: User.UserGetResponse;
  }

  export interface GatewayPermissionApplicationListByTypeGetResponse {
    code: number;
    message: string;
    data: Permission.PermissionApplicationListByTypeData;
  }

  export interface GatewayPermissionApplicationAddRequest {
    appId: number;
    appOtherId: number;
    appName: string;
    appAliasName?: string;
    appType?: number;
    appGameType?: number;
    appUrl?: string;
    appCallbackUrl?: string;
    userId: number;
    timestamp: number;
    sign: string;
  }

  export interface GatewayPermissionApplicationAddResponse {
    code: number;
    message: string;
    data: Permission.PermissionApplicationAddResponse;
  }

  export interface GatewayPermissionApplicationGetRequest {
    id: number;
    appId: number;
    appName?: string;
    timestamp: number;
    sign: string;
  }

  export interface GatewayPermissionApplicationGetResponse {
    code: number;
    message: string;
    data: GatewayPermission.GatewayPermissionApplicationGetData;
  }

  export interface GatewayPermissionApplicationGetData {
    appId: number;
    appType: number;
    appTypeName: string;
    appGameType: number;
    appName: string;
    appAliasName: string;
    appUrl: string;
    appCallbackUrl: string;
    userList: GatewayPermission.GatewayPermissionUserData[];
    groupList: GatewayPermission.GatewayPermissionUserGroupData[];
  }

  export interface GatewayPermissionUserGroupData {
    groupId: number;
    groupName: string;
    groupUserNum: number;
    creator: User.UserGetResponse;
    description: string;
    status: boolean;
    createTime: number;
    appId: number;
    appName: string;
  }

  export interface GatewayPermissionApplicationEditRequest {
    id: number;
    appId: number;
    appOtherId: number;
    appName?: string;
    appAliasName?: string;
    appUrl?: string;
    appCallbackUrl?: string;
    userId: number;
    timestamp: number;
    sign: string;
  }

  export interface GatewayPermissionApplicationEditResponse {
    code: number;
    message: string;
    data: Permission.PermissionApplicationUpdateResponse;
  }

  export interface GatewayPermissionApplicationFunctionAddRequest {
    appId: number;
    appOtherId: number;
    appFunctionName?: string;
    appFunctionAliasName?: string;
    appFunctionType: number;
    appParentId: number;
    appFunctionCreator: number;
    timestamp: number;
    sign: string;
  }

  export interface GatewayPermissionApplicationFunctionAddResponse {
    code: number;
    message: string;
    data: Permission.PermissionApplicationFunctionAddResponse;
  }

  export interface GatewayPermissionApplicationFunctionEditRequest {
    appId: number;
    appOtherId: number;
    id: number;
    appFunctionName?: string;
    appFunctionAliasName?: string;
    appFunctionType?: number;
    appParentId?: number;
    appFunctionOrder?: number;
    appFunctionCreator?: number;
    timestamp: number;
    sign: string;
  }

  export interface GatewayPermissionApplicationFunctionEditResponse {
    code: number;
    message: string;
    data: Permission.PermissionApplicationFunctionUpdateResponse;
  }

  export interface GatewayPermissionApplicationFunctionMoveRequest {
    appId: number;
    otherAppId: number;
    idList: number[];
    timestamp: number;
    sign: string;
  }

  export interface GatewayPermissionApplicationFunctionMoveResponse {
    code: number;
    message: string;
    data: Permission.PermissionApplicationFunctionMoveResponse;
  }

  export interface GatewayPermissionApplicationFunctionEnableOrDisableRequest {
    id: number;
    appId: number;
    appOtherId: number;
    appFunctionStatus: number;
    timestamp: number;
    sign: string;
  }

  export interface GatewayPermissionApplicationFunctionEnableOrDisableResponse {
    code: number;
    message: string;
    data: Permission.PermissionApplicationFunctionEnableOrDisableResponse;
  }

  export interface GatewayPermissionApplicationEnableOrDisableRequest {
    id: number;
    appId: number;
    appOtherId: number;
    appStatus: number;
    timestamp: number;
    sign: string;
  }

  export interface GatewayPermissionApplicationEnableOrDisableResponse {
    code: number;
    message: string;
    data: Permission.PermissionApplicationEnableOrDisableResponse;
  }

  export interface GatewayPermissionApplicationKeyEditRequest {
    id: number;
    appId: number;
    appOtherId: number;
    appName: string;
    timestamp: number;
    sign: string;
  }

  export interface GatewayPermissionApplicationKeyEditResponse {
    code: number;
    message: string;
    data: Permission.PermissionApplicationUpdatePrivateKeyResponse;
  }

  export interface GatewayPermissionApplicationKeyGetRequest {
    id: number;
    appId: number;
    appOtherId: number;
    timestamp: number;
    sign: string;
  }

  export interface GatewayPermissionApplicationKeyGetResponse {
    code: number;
    message: string;
    data: Permission.PermissionApplicationGetPrivateKeyResponse;
  }

  export interface GatewayPermissionApplicationTypeGetRequest {
    appId: number;
    timestamp: number;
    sign: string;
  }

  export interface GatewayPermissionApplicationTypeGetResponse {
    code: number;
    message: string;
    data: Permission.PermissionApplicationTypeGetResponse;
  }

  export interface GatewayPermissionApplicationFunctionListGetRequest {
    appId: number;
    appOtherId: number;
    timestamp: number;
    sign: string;
    groupId?: number;
    mode: number;
  }

  export interface GatewayPermissionApplicationFunctionListGetResponse {
    code: number;
    message: string;
    data: GatewayPermission.GatewayPermissionApplicationFunctionListGetData;
  }

  export interface GatewayPermissionApplicationFunctionListGetData {
    functionsList: GatewayPermission.GatewayPermissionApplicationFunctionGetData[];
  }

  export interface GatewayPermissionApplicationFunctionGetData {
    id: number;
    appId: number;
    appFunctionName: string;
    appFunctionAliasName: string;
    appFunctionType: number;
    appParentId: number;
    appFunctionLevel: number;
    appFunctionOrder: number;
    appFunctionCreateTime: number;
    appFunctionCreator: number;
    appFunctionStatus: number;
    creator: GatewayPermission.GatewayPermissionUserData;
  }

  export interface GatewayPermissionApplicationFunctionListUpdateRequest {
    appId: number;
    appOtherId: number;
    timestamp: number;
    sign: string;
    groupId?: number;
    idList: number[];
  }

  export interface GatewayPermissionApplicationFunctionListUpdateResponse {
    code: number;
    message: string;
  }

  export interface GatewayPermissionUserGroupListGetRequest {
    appId: number;
    sign: string;
    timestamp: number;
    start: number;
    limit: number;
    otherAppId: number;
  }

  export interface GatewayPermissionUserGroupListGetResponse {
    code: number;
    message: string;
    data: Permission.PermissionUserGroupDataList;
  }

  export interface GatewayPermissionUserGroupAddRequest {
    appId: number;
    sign: string;
    timestamp: number;
    otherAppId: number;
    groupName: string;
    description: string;
    userId: number;
  }

  export interface GatewayPermissionUserGroupAddResponse {
    code: number;
    message: string;
    data: Permission.PermissionUserGroupData;
  }

  export interface GatewayPermissionUserGroupRemoveRequest {
    appId: number;
    sign: string;
    timestamp: number;
    groupId: number;
  }

  export interface GatewayPermissionUserGroupRemoveResponse {
    code: number;
    message: string;
  }

  export interface GatewayPermissionUserGroupDisableRequest {
    appId: number;
    sign: string;
    timestamp: number;
    groupId: number;
  }

  export interface GatewayPermissionUserGroupDisableResponse {
    code: number;
    message: string;
  }

  export interface GatewayPermissionUserGroupsOfUserGetRequest {
    appId: number;
    sign: string;
    timestamp: number;
    userId: number;
  }

  export interface GatewayPermissionUserGroupsOfUserGetResponse {
    code: number;
    message: string;
    data: Permission.PermissionUserGroupDataList;
  }

  export interface GatewayGameAdminListGetRequest {
    appId: number;
    timestamp: number;
    sign: string;
    gameName?: string;
    userName?: string;
    start: number;
    limit: number;
    sortKey: string;
    sortOrder: string;
  }

  export interface GatewayGameAdminListGetResponse {
    code: number;
    message: string;
    data: GatewayPermission.GatewayGameAdminListGetData;
  }

  export interface GatewayGameAdminListGetData {
    count: number;
    gamelistList: GatewayPermission.GameAdminListGetData[];
  }

  export interface GameAdminListGetData {
    gameId: number;
    gameName: string;
    createTime: number;
    authorizedTimeList: number[];
    adminList: GatewayPermission.GatewayPermissionUserData[];
    authorizedNum: number;
    groupId: number;
    authorizedGroupId: number;
  }

  export interface GatewayUserPermissionGetRequest {
    appId: number;
    userId: number;
  }

  export interface GatewayUserPermissionGetResponse {
    permissionList: Permission.UserPermissionData[];
  }

  export interface GatewayUserGroupRelationGetRequest {
    appId: number;
    timestamp: number;
    sign: string;
    groupId: number;
  }

  export interface GatewayUserGroupRelationGetResponse {
    userGroupRelationsList: GatewayPermission.GatewayUserGroupRelation[];
  }

  export interface GatewayUserGroupRelation {
    userGroupRelationId: number;
    userId: number;
    groupId: number;
    createTime: number;
    displayName: string;
  }

  export interface GatewayUserGroupRelationSetRequest {
    appId: number;
    timestamp: number;
    sign: string;
    userGroupRelationsList: Permission.UserGroupRelation[];
  }

  export interface GatewayUserGroupRelationSetResponse {
    code: number;
    message: string;
    count: number;
  }

  export interface GatewayPermissionGameListGetRequest {
    appId: number;
    timestamp: number;
    sign: string;
    gameName?: string;
    start: number;
    limit: number;
    sortKey: string;
    sortOrder: string;
    userId: number;
  }

  export interface GatewayPermissionGameListGetResponse {
    code: number;
    message: string;
    data: GatewayPermission.GatewayPermissionGameDataList;
  }

  export interface GatewayPermissionGameDataList {
    count: number;
    userGroupList: GatewayPermission.GatewayPermissionGameData[];
  }

  export interface GatewayPermissionGameData {
    gameId: number;
    gameName: string;
    userList: GatewayPermission.GatewayPermissionUserInfo[];
    permitTimestampList: number[];
    createTimestamp: number;
    permitMemberCount: number;
    groupId: number;
  }

  export interface GatewayPermissionUserInfo {
    userName: string;
    userInfo: User.UserGetResponse;
  }

  export interface GatewayPermissionGameInfoListGetRequest {
    appId: number;
    timestamp: number;
    sign: string;
    gameName?: string;
    adminName?: string;
    start: number;
    limit: number;
    sortKey: string;
    sortOrder: string;
  }

  export interface GatewayPermissionGameInfoListGetResponse {
    code: number;
    message: string;
    data: GatewayPermission.GatewayPermissionGameDataList;
  }

  export interface GatewayUserAccountManagementUserListGetRequest {
    appId: number;
    timestamp: number;
    sign: string;
    userName?: string;
    userType?: number;
    userStatus?: number;
    start: number;
    limit: number;
  }

  export interface GatewayUserAccountManagementUserListGetResponse {
    code: number;
    message: string;
    data: User.AccountManagementUserListGetResponse;
  }

  export interface GatewayAuthPageGetRequest {
    appId: number;
    timestamp: number;
    sign: string;
    userId: number;
  }

  export interface GatewayAuthPageGetResponse {
    code: number;
    message: string;
    data: GatewayPermission.GatewayAuthPageInfo;
  }

  export interface GatewayAuthPageInfo {
    userInfo: User.UserGetResponse;
    groupList: Permission.PermissionUserGroupDataList;
    gameAuth: GatewayPermission.GatewayPermissionGameAuthListGetResponse;
  }

  export interface GatewayPermissionGameAuthListGetResponse {
    code: number;
    message: string;
    gameAuthInfoList: GatewayPermission.GameAuthInfo[];
  }

  export interface GameAuthInfo {
    gameId: number;
    gameName: string;
    permitTimestamp: number;
    userInfoList: User.UserGetResponse[];
  }

  export interface GatewayPermissionGameAuthListGetRequest {
    appId: number;
    timestamp: number;
    sign: string;
    userId: number;
  }

  export interface GatewayPermissionGameAddRequest {
    appId: number;
    timestamp: number;
    sign: string;
    appOtherId: number;
    appName: string;
    userId: number;
  }

  export interface GatewayPermissionGameAddResponse {
    code: number;
    message: string;
  }
}

export namespace GatewayUser{ 

  export interface GatewayLoginRequest {
    userName: string;
    password: string;
    appId: number;
    timestamp: number;
    sign: string;
  }

  export interface GatewayRegisterRequest {
    userName: string;
    password: string;
    appId: number;
    timestamp: number;
    sign: string;
    userSrc: string;
  }

  export interface GatewayLoginOrRegisterResponse {
    code: number;
    message: string;
    data: GatewayUser.GatewayLoginOrRegisterData;
  }

  export interface GatewayLoginOrRegisterData {
    userId: number;
    userName: string;
    userType: number;
    appSt: string;
    accessToken: string;
    displayName: string;
  }

  export interface GatewayCheckSTRequest {
    appId: number;
    appSt: string;
    timestamp: number;
    sign: string;
  }

  export interface GatewayCheckSTResponse {
    code: number;
    message: string;
    data: GatewayUser.GatewayCheckSTData;
  }

  export interface GatewayCheckSTData {
    userId: number;
    userName: string;
    userAppPermission: Permission.UserPermissionGetResponse;
    userGame4usInfo: User.UserGame4usUserInfo;
  }

  export interface GatewayCheckTGCRequest {
    appId: number;
    timestamp: number;
    sign: string;
  }

  export interface GatewayCheckTGCResponse {
    code: number;
    message: string;
    data: GatewayUser.GatewayLoginOrRegisterData;
  }

  export interface GatewayUserLogoutRequest {
    appId: number;
    timestamp: number;
    sign: string;
  }

  export interface GatewayUserLogoutResponse {
    code: number;
    message: string;
  }

  export interface GatewayOrganizationGetRequest {
    appId: number;
    depId?: number;
    groupId?: number;
    timestamp: number;
    sign: string;
  }

  export interface GatewayOrganizationGetResponse {
    code: number;
    message: string;
    data: GatewayUser.GatewayOrganizationGetData;
  }

  export interface GatewayOrganizationGetData {
    organization: string;
    selectedUserList: GatewayUser.GatewayUserSelectedData[];
  }

  export interface GatewayUserSelectedData {
    id: number;
    label: string;
    email: string;
  }

  export interface GatewaySystemTimeRequest {
    appId: number;
    timestamp: number;
    sign: string;
  }

  export interface GatewaySystemTimeResponse {
    code: number;
    message: string;
    systemTime: number;
  }

  export interface GatewayUserStatusUpdateRequest {
    appId: number;
    sign: string;
    timestamp: number;
    userId: number;
    userStatus: number;
  }

  export interface GatewayUserStatusUpdateResponse {
    code: number;
    message: string;
  }

  export interface GetwayGetUserInfoRequest {
    appId: number;
    sign: string;
    timestamp: number;
    userId: number;
  }

  export interface GetwayGetUserInfoResponse {
    code: number;
    message: string;
    userInfo: User.UserGetResponse;
  }

  export interface GatewayCodeToEmailSendRequest {
    appId: number;
    sign: string;
    timestamp: number;
    email: string;
    type: number;
  }

  export interface GatewayCodeToEmailSendResponse {
    code: number;
    message: string;
    data: User.UserCodeToEmailSendResponse;
  }

  export interface GatewayEmailCodeCheckRequest {
    appId: number;
    sign: string;
    timestamp: number;
    userId: number;
    emailCode: string;
    type: number;
  }

  export interface GatewayEmailCodeCheckResponse {
    code: number;
    message: string;
    data: User.UserEmailCodeCheckResponse;
  }

  export interface GatewayPasswordForgetRequest {
    appId: number;
    sign: string;
    timestamp: number;
    userName: string;
    userId: number;
    emailCode: string;
    newPwd: string;
  }

  export interface GatewayPasswordForgetResponse {
    code: number;
    message: string;
    data: User.UserPasswordForgetResponse;
  }

  export interface GatewayPasswordChangeRequest {
    appId: number;
    sign: string;
    timestamp: number;
    userName: string;
    userId: number;
    oldPwd: string;
    newPwd: string;
  }

  export interface GatewayPasswordChangeResponse {
    code: number;
    message: string;
    data: User.UserPasswordChangeResponse;
  }

  export interface GatewayGame4usUserInfoUpdateRequest {
    appId: number;
    sign: string;
    timestamp: number;
    userId: number;
    nickName: string;
    avatar: string;
    sex: number;
    signature: string;
  }

  export interface GatewayGame4usUserInfoUpdateResponse {
    code: number;
    message: string;
    data: User.UserGame4usUserInfoUpdateResponse;
  }

  export interface GatewaySecurityInfoGetRequest {
    appId: number;
    sign: string;
    timestamp: number;
    userId: number;
    userName: string;
  }

  export interface GatewaySecurityInfoGetResponse {
    code: number;
    message: string;
    data: User.UserSecurityInfoGetResponse;
  }

  export interface GatewaySecurityMailBindRequest {
    appId: number;
    sign: string;
    timestamp: number;
    userId: number;
    email: string;
  }

  export interface GatewaySecurityMailBindResponse {
    code: number;
    message: string;
    data: User.UserSecurityMailBindResponse;
  }

  export interface GatewayBindMailConfirmRequest {
    appId: number;
    sign: string;
    timestamp: number;
    userId: number;
    userName: string;
    email: string;
    emailCode: string;
  }

  export interface GatewayBindMailConfirmResponse {
    code: number;
    message: string;
    data: User.UserBindMailConfirmResponse;
  }

  export interface GatewayThirdBindStateGetRequest {
    appId: number;
    sign: string;
    timestamp: number;
    type: number;
    thirdAccessToken: string;
    userId?: number;
  }

  export interface GatewayThirdBindStateGetResponse {
    code: number;
    message: string;
    data: GatewayUser.GatewayThirdBindStateGetData;
  }

  export interface GatewayThirdBindStateGetData {
    state: number;
    thirdUserId: string;
    thirdAccount: string;
    userId: number;
  }

  export interface GatewayLoginThirdAccountRequest {
    appId: number;
    sign: string;
    timestamp: number;
    userId: number;
    thirdAccessToken: string;
    type: number;
  }

  export interface GatewayThirdAccountBindRequest {
    appId: number;
    sign: string;
    timestamp: number;
    userId: number;
    type: number;
    thirdUserId: string;
    thirdAccount: string;
  }

  export interface GatewayThirdAccountBindResponse {
    code: number;
    message: string;
    data: User.UserThirdAccountBindResponse;
  }

  export interface GatewayThirdAccountUnbindRequest {
    appId: number;
    sign: string;
    timestamp: number;
    userId: number;
    type: number;
  }

  export interface GatewayThirdAccountUnbindResponse {
    code: number;
    message: string;
    data: User.UserThirdAccountUnbindResponse;
  }
}

export interface ReqFunc {
  (path: string, options: ReqOptions): Promise<any>;
}

const TIMEOUT = 15000;

const defaultOptions = {
  method: 'POST',
  timeout: TIMEOUT,
  headers: { 'Content-Type': 'application/json' },
};

export namespace GatewayApiClient {

  export async function dataApiCollection(body: Gateway.GatewayDataCollectionRequest, request: ReqFunc, options?: ReqOptions): Promise<Gateway.GatewayDataCollectionResponse> {
    const path = '/v1/data/collection';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as Gateway.GatewayDataCollectionResponse;
  }

  export async function getUploadingUrl(body: Gateway.GatewayGetUploadingUrlReq, request: ReqFunc, options?: ReqOptions): Promise<Gateway.GatewayGetUploadingUrlRes> {
    const path = '/v1/file/getUploadingUrl';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as Gateway.GatewayGetUploadingUrlRes;
  }

  export async function getDownloadingUrl(body: Gateway.GatewayGetDownloadingUrlReq, request: ReqFunc, options?: ReqOptions): Promise<Gateway.GatewayGetDownloadingUrlRes> {
    const path = '/v1/file/getDownloadingUrl';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as Gateway.GatewayGetDownloadingUrlRes;
  }

  export async function gameApiLogin(body: GatewayGame.GatewayGameLoginRequest, request: ReqFunc, options?: ReqOptions): Promise<GatewayGame.GatewayGameLoginResponse> {
    const path = '/v1/game/login';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayGame.GatewayGameLoginResponse;
  }

  export async function gameApiBindAccount(body: GatewayGame.GatewayGameBindAccountRequest, request: ReqFunc, options?: ReqOptions): Promise<GatewayGame.GatewayGameBindAccountResponse> {
    const path = '/v1/game/bindAccount';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayGame.GatewayGameBindAccountResponse;
  }

  export async function gameApiCheckSession(body: GatewayGame.GatewayGameCheckSessionRequest, request: ReqFunc, options?: ReqOptions): Promise<GatewayGame.GatewayGameCheckSessionResponse> {
    const path = '/v1/game/checkSession';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayGame.GatewayGameCheckSessionResponse;
  }

  export async function gameApiUpdateFCM(body: GatewayGame.GatewayGameUpdateFCMRequest, request: ReqFunc, options?: ReqOptions): Promise<GatewayGame.GatewayGameUpdateFCMResponse> {
    const path = '/v1/game/updateFCM';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayGame.GatewayGameUpdateFCMResponse;
  }

  export async function gMToolApiGetGameServerList(body: GatewayGmtool.GatewayGameServerListGetReq, request: ReqFunc, options?: ReqOptions): Promise<GatewayGmtool.GatewayGameServerListGetRes> {
    const path = '/v1/gmtool/common/getGameServerList';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayGmtool.GatewayGameServerListGetRes;
  }

  export async function gMToolApiChangeGameServerState(body: GatewayGmtool.GatewayGameServerStateChangeReq, request: ReqFunc, options?: ReqOptions): Promise<GatewayGmtool.GatewayGameServerStateChangeRes> {
    const path = '/v1/gmtool/common/changeGameServerState';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayGmtool.GatewayGameServerStateChangeRes;
  }

  export async function gMToolApiGetChannelList(body: GatewayGmtool.GatewayChannelListGetReq, request: ReqFunc, options?: ReqOptions): Promise<GatewayGmtool.GatewayChannelListGetRes> {
    const path = '/v1/gmtool/common/getChannelList';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayGmtool.GatewayChannelListGetRes;
  }

  export async function gMToolApiGetFunctionList(body: GatewayGmtool.GatewayFunctionListGetReq, request: ReqFunc, options?: ReqOptions): Promise<GatewayGmtool.GatewayFunctionListGetRes> {
    const path = '/v1/gmtool/func/getList';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayGmtool.GatewayFunctionListGetRes;
  }

  export async function gMToolApiCreateFunction(body: GatewayGmtool.GatewayFunctionCreateReq, request: ReqFunc, options?: ReqOptions): Promise<GatewayGmtool.GatewayFunctionCreateRes> {
    const path = '/v1/gmtool/func/create';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayGmtool.GatewayFunctionCreateRes;
  }

  export async function gMToolApiEditFunction(body: GatewayGmtool.GatewayFunctionEditReq, request: ReqFunc, options?: ReqOptions): Promise<GatewayGmtool.GatewayFunctionEditRes> {
    const path = '/v1/gmtool/func/edit';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayGmtool.GatewayFunctionEditRes;
  }

  export async function gMToolApiChangeFunctionState(body: GatewayGmtool.GatewayFunctionStateChangeReq, request: ReqFunc, options?: ReqOptions): Promise<GatewayGmtool.GatewayFunctionStateChangeRes> {
    const path = '/v1/gmtool/func/changeState';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayGmtool.GatewayFunctionStateChangeRes;
  }

  export async function gMToolApiGetGameList(body: GatewayGmtool.GatewayGameListGetReq, request: ReqFunc, options?: ReqOptions): Promise<GatewayGmtool.GatewayGameListGetRes> {
    const path = '/v1/gmtool/common/getGameList';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayGmtool.GatewayGameListGetRes;
  }

  export async function gMToolApiCreateGiftPackageBatch(body: GatewayGmtool.GatewayGiftPackageBatchCreateReq, request: ReqFunc, options?: ReqOptions): Promise<GatewayGmtool.GatewayGiftPackageBatchCreateRes> {
    const path = '/v1/gmtool/gift/createBatch';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayGmtool.GatewayGiftPackageBatchCreateRes;
  }

  export async function gMToolApiUpdateGiftPackageBatch(body: GatewayGmtool.GatewayGiftPackageBatchUpdateReq, request: ReqFunc, options?: ReqOptions): Promise<GatewayGmtool.GatewayGiftPackageBatchUpdateRes> {
    const path = '/v1/gmtool/gift/updateBatch';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayGmtool.GatewayGiftPackageBatchUpdateRes;
  }

  export async function gMToolApiGetGiftPackageBatchList(body: GatewayGmtool.GatewayGiftPackageBatchListGetReq, request: ReqFunc, options?: ReqOptions): Promise<GatewayGmtool.GatewayGiftPackageBatchListGetRes> {
    const path = '/v1/gmtool/gift/getBatchList';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayGmtool.GatewayGiftPackageBatchListGetRes;
  }

  export async function gMToolApiAddActivationCode(body: GatewayGmtool.GatewayActivationCodeAddReq, request: ReqFunc, options?: ReqOptions): Promise<GatewayGmtool.GatewayActivationCodeAddRes> {
    const path = '/v1/gmtool/gift/addActivationCode';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayGmtool.GatewayActivationCodeAddRes;
  }

  export async function gMToolApiChangeGiftPackageBatchState(body: GatewayGmtool.GatewayGiftPackageBatchStateChangeReq, request: ReqFunc, options?: ReqOptions): Promise<GatewayGmtool.GatewayGiftPackageBatchStateChangeRes> {
    const path = '/v1/gmtool/gift/changeBatchState';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayGmtool.GatewayGiftPackageBatchStateChangeRes;
  }

  export async function gMToolApiGetItemlList(body: GatewayGmtool.GatewayItemListGetReq, request: ReqFunc, options?: ReqOptions): Promise<GatewayGmtool.GatewayItemListGetRes> {
    const path = '/v1/gmtool/common/getItemList';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayGmtool.GatewayItemListGetRes;
  }

  export async function gMToolApiExportActivationCode(body: GatewayGmtool.GatewayActivationCodeExportReq, request: ReqFunc, options?: ReqOptions): Promise<GatewayGmtool.GatewayActivationCodeExportRes> {
    const path = '/v1/gmtool/gift/exportActivationCode';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayGmtool.GatewayActivationCodeExportRes;
  }

  export async function gMToolApiUseActivationCode(body: GatewayGmtool.GatewayActivationCodeUseReq, request: ReqFunc, options?: ReqOptions): Promise<GatewayGmtool.GatewayActivationCodeUseRes> {
    const path = '/v1/gmtool/gift/useActivationCode';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayGmtool.GatewayActivationCodeUseRes;
  }

  export async function gMToolApiGetFunction(body: GatewayGmtool.GatewayFunctionGetReq, request: ReqFunc, options?: ReqOptions): Promise<GatewayGmtool.GatewayFunctionGetRes> {
    const path = '/v1/gmtool/func/get';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayGmtool.GatewayFunctionGetRes;
  }

  export async function gMToolApiAddPublishType(body: GatewayGmtool.GatewayPublishTypeAddReq, request: ReqFunc, options?: ReqOptions): Promise<GatewayGmtool.GatewayPublishTypeAddRes> {
    const path = '/v1/gmtool/config/addPublishType';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayGmtool.GatewayPublishTypeAddRes;
  }

  export async function gMToolApiEditPublishType(body: GatewayGmtool.GatewayPublishTypeEditReq, request: ReqFunc, options?: ReqOptions): Promise<GatewayGmtool.GatewayPublishTypeEditRes> {
    const path = '/v1/gmtool/config/editPublishType';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayGmtool.GatewayPublishTypeEditRes;
  }

  export async function gMToolApiChangePublishTypeState(body: GatewayGmtool.GatewayPublishTypeStateChangeReq, request: ReqFunc, options?: ReqOptions): Promise<GatewayGmtool.GatewayPublishTypeStateChangeRes> {
    const path = '/v1/gmtool/config/changePublishTypeState';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayGmtool.GatewayPublishTypeStateChangeRes;
  }

  export async function gMToolApiGetPublishTypeList(body: GatewayGmtool.GatewayPublishTypeListGetReq, request: ReqFunc, options?: ReqOptions): Promise<GatewayGmtool.GatewayPublishTypeListGetRes> {
    const path = '/v1/gmtool/config/getPublishTypeList';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayGmtool.GatewayPublishTypeListGetRes;
  }

  export async function gMToolApiChangeLanguageState(body: GatewayGmtool.GatewayLanguageStateChangeReq, request: ReqFunc, options?: ReqOptions): Promise<GatewayGmtool.GatewayLanguageStateChangeRes> {
    const path = '/v1/gmtool/config/changeLanguageState';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayGmtool.GatewayLanguageStateChangeRes;
  }

  export async function gMToolApiGetLanguageList(body: GatewayGmtool.GatewayLanguageListGetReq, request: ReqFunc, options?: ReqOptions): Promise<GatewayGmtool.GatewayLanguageListGetRes> {
    const path = '/v1/gmtool/config/getLanguageList';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayGmtool.GatewayLanguageListGetRes;
  }

  export async function gMToolApiAddMsgTmpl(body: GatewayGmtool.GatewayMsgTmplAddReq, request: ReqFunc, options?: ReqOptions): Promise<GatewayGmtool.GatewayMsgTmplAddRes> {
    const path = '/v1/gmtool/config/addMsgTmpl';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayGmtool.GatewayMsgTmplAddRes;
  }

  export async function gMToolApiEditMsgTmpl(body: GatewayGmtool.GatewayMsgTmplEditReq, request: ReqFunc, options?: ReqOptions): Promise<GatewayGmtool.GatewayMsgTmplEditRes> {
    const path = '/v1/gmtool/config/editMsgTmpl';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayGmtool.GatewayMsgTmplEditRes;
  }

  export async function gMToolApiDelMsgTmpl(body: GatewayGmtool.GatewayMsgTmplDelReq, request: ReqFunc, options?: ReqOptions): Promise<GatewayGmtool.GatewayMsgTmplDelRes> {
    const path = '/v1/gmtool/config/deleteMsgTmpl';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayGmtool.GatewayMsgTmplDelRes;
  }

  export async function gMToolApiGetMsgTmplList(body: GatewayGmtool.GatewayMsgTmplListGetReq, request: ReqFunc, options?: ReqOptions): Promise<GatewayGmtool.GatewayMsgTmplListGetRes> {
    const path = '/v1/gmtool/config/getMsgTmplList';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayGmtool.GatewayMsgTmplListGetRes;
  }

  export async function gMToolApiAddPlayersModel(body: GatewayGmtool.GatewayPlayersModelAddReq, request: ReqFunc, options?: ReqOptions): Promise<GatewayGmtool.GatewayPlayersModelAddRes> {
    const path = '/v1/gmtool/config/addPlayersModel';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayGmtool.GatewayPlayersModelAddRes;
  }

  export async function gMToolApiEditPlayersModel(body: GatewayGmtool.GatewayPlayersModelEditReq, request: ReqFunc, options?: ReqOptions): Promise<GatewayGmtool.GatewayPlayersModelEditRes> {
    const path = '/v1/gmtool/config/editPlayersModel';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayGmtool.GatewayPlayersModelEditRes;
  }

  export async function gMToolApiDelPlayersModel(body: GatewayGmtool.GatewayPlayersModelDelReq, request: ReqFunc, options?: ReqOptions): Promise<GatewayGmtool.GatewayPlayersModelDelRes> {
    const path = '/v1/gmtool/config/deletePlayersModel';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayGmtool.GatewayPlayersModelDelRes;
  }

  export async function gMToolApiGetPlayersModelList(body: GatewayGmtool.GatewayPlayersModelListGetReq, request: ReqFunc, options?: ReqOptions): Promise<GatewayGmtool.GatewayPlayersModelListGetRes> {
    const path = '/v1/gmtool/config/getPlayersModelList';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayGmtool.GatewayPlayersModelListGetRes;
  }

  export async function gMToolApiCompleteCalculationTask(body: GatewayGmtool.GatewayCalculationTaskCompleteReq, request: ReqFunc, options?: ReqOptions): Promise<GatewayGmtool.GatewayCalculationTaskCompleteRes> {
    const path = '/v1/gmtool/message/completeCalcTask';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayGmtool.GatewayCalculationTaskCompleteRes;
  }

  export async function gMToolApiGetGameWhiteList(body: GatewayGmtool.GatewayGameWhiteListGetReq, request: ReqFunc, options?: ReqOptions): Promise<GatewayGmtool.GatewayGameWhiteListGetRes> {
    const path = '/v1/gmtool/whitelist/getList';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayGmtool.GatewayGameWhiteListGetRes;
  }

  export async function gMToolApiAddUsersToGameWhiteList(body: GatewayGmtool.GatewayUsersToGameWhiteListAddReq, request: ReqFunc, options?: ReqOptions): Promise<GatewayGmtool.GatewayUsersToGameWhiteListAddRes> {
    const path = '/v1/gmtool/whitelist/addUsers';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayGmtool.GatewayUsersToGameWhiteListAddRes;
  }

  export async function gMToolApiRemoveUsersFromGameWhiteList(body: GatewayGmtool.GatewayUsersFromGameWhiteListRemoveReq, request: ReqFunc, options?: ReqOptions): Promise<GatewayGmtool.GatewayUsersFromGameWhiteListRemoveRes> {
    const path = '/v1/gmtool/whitelist/removeUsers';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayGmtool.GatewayUsersFromGameWhiteListRemoveRes;
  }

  export async function gMToolApiCreateMsg(body: GatewayGmtool.GatewayMsgCreateReq, request: ReqFunc, options?: ReqOptions): Promise<GatewayGmtool.GatewayMsgCreateRes> {
    const path = '/v1/gmtool/msg/create';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayGmtool.GatewayMsgCreateRes;
  }

  export async function gMToolApiEditMsg(body: GatewayGmtool.GatewayMsgEditReq, request: ReqFunc, options?: ReqOptions): Promise<GatewayGmtool.GatewayMsgEditRes> {
    const path = '/v1/gmtool/msg/edit';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayGmtool.GatewayMsgEditRes;
  }

  export async function gMToolApiChangeMsgState(body: GatewayGmtool.GatewayMsgStateChangeReq, request: ReqFunc, options?: ReqOptions): Promise<GatewayGmtool.GatewayMsgStateChangeRes> {
    const path = '/v1/gmtool/msg/changeState';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayGmtool.GatewayMsgStateChangeRes;
  }

  export async function gMToolApiGetMsgList(body: GatewayGmtool.GatewayMsgListGetReq, request: ReqFunc, options?: ReqOptions): Promise<GatewayGmtool.GatewayMsgListGetRes> {
    const path = '/v1/gmtool/msg/getList';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayGmtool.GatewayMsgListGetRes;
  }

  export async function gMToolApiGetMsg(body: GatewayGmtool.GatewayMsgGetReq, request: ReqFunc, options?: ReqOptions): Promise<GatewayGmtool.GatewayMsgGetRes> {
    const path = '/v1/gmtool/msg/get';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayGmtool.GatewayMsgGetRes;
  }

  export async function gMToolApiPublishMsg(body: GatewayGmtool.GatewayMsgPublishReq, request: ReqFunc, options?: ReqOptions): Promise<GatewayGmtool.GatewayMsgPublishRes> {
    const path = '/v1/gmtool/msg/publish';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayGmtool.GatewayMsgPublishRes;
  }

  export async function gMToolApiGetAnnounce(body: GatewayGmtool.GatewayAnnounceGetReq, request: ReqFunc, options?: ReqOptions): Promise<GatewayGmtool.GatewayAnnounceGetRes> {
    const path = '/v1/gmtool/msg/getAnnounce';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayGmtool.GatewayAnnounceGetRes;
  }

  export async function gMToolCreateGameEvent(body: GatewayGmtool.GatewayGameEventCreateReq, request: ReqFunc, options?: ReqOptions): Promise<GatewayGmtool.GatewayGameEventCreateRes> {
    const path = '/v1/gmtool/event/createGameEvent';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayGmtool.GatewayGameEventCreateRes;
  }

  export async function gMToolEditGameEvent(body: GatewayGmtool.GatewayGameEventEditReq, request: ReqFunc, options?: ReqOptions): Promise<GatewayGmtool.GatewayGameEventEditRes> {
    const path = '/v1/gmtool/event/editGameEvent';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayGmtool.GatewayGameEventEditRes;
  }

  export async function gMToolChangeGameEventState(body: GatewayGmtool.GatewayGameEventStateChangeReq, request: ReqFunc, options?: ReqOptions): Promise<GatewayGmtool.GatewayGameEventStateChangeRes> {
    const path = '/v1/gmtool/event/changeGameEventState';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayGmtool.GatewayGameEventStateChangeRes;
  }

  export async function gMToolGetGameEventList(body: GatewayGmtool.GatewayGameEventListGetReq, request: ReqFunc, options?: ReqOptions): Promise<GatewayGmtool.GatewayGameEventListGetRes> {
    const path = '/v1/gmtool/event/getGameEventList';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayGmtool.GatewayGameEventListGetRes;
  }

  export async function gMToolGetGameEventDetail(body: GatewayGmtool.GatewayGameEventDetailGetReq, request: ReqFunc, options?: ReqOptions): Promise<GatewayGmtool.GatewayGameEventDetailGetRes> {
    const path = '/v1/gmtool/event/getGameEventDetail';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayGmtool.GatewayGameEventDetailGetRes;
  }

  export async function gMToolAddGameEventTmpl(body: GatewayGmtool.GatewayGameEventTmplAddReq, request: ReqFunc, options?: ReqOptions): Promise<GatewayGmtool.GatewayGameEventTmplAddRes> {
    const path = '/v1/gmtool/config/addGameEventTmpl';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayGmtool.GatewayGameEventTmplAddRes;
  }

  export async function gMToolEditGameEventTmpl(body: GatewayGmtool.GatewayGameEventTmplEditReq, request: ReqFunc, options?: ReqOptions): Promise<GatewayGmtool.GatewayGameEventTmplEditRes> {
    const path = '/v1/gmtool/config/editGameEventTmpl';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayGmtool.GatewayGameEventTmplEditRes;
  }

  export async function gMToolDelGameEventTmpl(body: GatewayGmtool.GatewayGameEventTmplDelReq, request: ReqFunc, options?: ReqOptions): Promise<GatewayGmtool.GatewayGameEventTmplDelRes> {
    const path = '/v1/gmtool/config/delGameEventTmpl';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayGmtool.GatewayGameEventTmplDelRes;
  }

  export async function gMToolGetGameEventTmplList(body: GatewayGmtool.GatewayGameEventTmplListGetReq, request: ReqFunc, options?: ReqOptions): Promise<GatewayGmtool.GatewayGameEventTmplListGetRes> {
    const path = '/v1/gmtool/config/getGameEventTmplList';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayGmtool.GatewayGameEventTmplListGetRes;
  }

  export async function gMToolApiGetGameUserList(body: GatewayGmtool.GatewayGameUserListGetReq, request: ReqFunc, options?: ReqOptions): Promise<GatewayGmtool.GatewayGameUserListGetRes> {
    const path = '/v1/gmtool/user/getList';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayGmtool.GatewayGameUserListGetRes;
  }

  export async function gMToolApiGetGameUser(body: GatewayGmtool.GatewayGameUserGetReq, request: ReqFunc, options?: ReqOptions): Promise<GatewayGmtool.GatewayGameUserGetRes> {
    const path = '/v1/gmtool/user/getInfo';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayGmtool.GatewayGameUserGetRes;
  }

  export async function gMToolApiChangeGameUserState(body: GatewayGmtool.GatewayChangeGameUserStateReq, request: ReqFunc, options?: ReqOptions): Promise<GatewayGmtool.GatewayChangeGameUserStateRes> {
    const path = '/v1/gmtool/user/changeState';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayGmtool.GatewayChangeGameUserStateRes;
  }

  export async function paymentApiCreateOrder(body: GatewayPayment.GatewayPaymentCreateOrderRequest, request: ReqFunc, options?: ReqOptions): Promise<GatewayPayment.GatewayPaymentCreateOrderResponse> {
    const path = '/v1/payment/createOrder';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayPayment.GatewayPaymentCreateOrderResponse;
  }

  export async function paymentApiCheckOrder(body: GatewayPayment.GatewayPaymentCheckOrderRequest, request: ReqFunc, options?: ReqOptions): Promise<GatewayPayment.GatewayPaymentCheckOrderResponse> {
    const path = '/v1/payment/checkOrder';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayPayment.GatewayPaymentCheckOrderResponse;
  }

  export async function paymentApiCancelOrder(body: GatewayPayment.GatewayPaymentCancelOrderRequest, request: ReqFunc, options?: ReqOptions): Promise<GatewayPayment.GatewayPaymentCancelOrderResponse> {
    const path = '/v1/payment/cancelOrder';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayPayment.GatewayPaymentCancelOrderResponse;
  }

  export async function paymentApiQueryOrderDetail(body: GatewayPayment.GatewayPaymentQueryOrderDetailRequest, request: ReqFunc, options?: ReqOptions): Promise<GatewayPayment.GatewayPaymentQueryOrderDetailResponse> {
    const path = '/v1/payment/queryOrderDetail';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayPayment.GatewayPaymentQueryOrderDetailResponse;
  }

  export async function paymentApiQueryOrderList(body: GatewayPayment.GatewayPaymentQueryOrderListRequest, request: ReqFunc, options?: ReqOptions): Promise<GatewayPayment.GatewayPaymentQueryOrderListResponse> {
    const path = '/v1/payment/queryOrderList';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayPayment.GatewayPaymentQueryOrderListResponse;
  }

  export async function paymentApiRepairOrder(body: GatewayPayment.GatewayPaymentRepairOrderRequest, request: ReqFunc, options?: ReqOptions): Promise<GatewayPayment.GatewayPaymentRepairOrderResponse> {
    const path = '/v1/payment/repairOrder';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayPayment.GatewayPaymentRepairOrderResponse;
  }

  export async function permissionApiApplicationListGet(body: GatewayPermission.GatewayPermissionApplicationListGetRequest, request: ReqFunc, options?: ReqOptions): Promise<GatewayPermission.GatewayPermissionApplicationListGetResponse> {
    const path = '/v1/permission/getApplicationList';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayPermission.GatewayPermissionApplicationListGetResponse;
  }

  export async function permissionApiApplicationAdd(body: GatewayPermission.GatewayPermissionApplicationAddRequest, request: ReqFunc, options?: ReqOptions): Promise<GatewayPermission.GatewayPermissionApplicationAddResponse> {
    const path = '/v1/permission/addApplication';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayPermission.GatewayPermissionApplicationAddResponse;
  }

  export async function permissionApiApplicationGet(body: GatewayPermission.GatewayPermissionApplicationGetRequest, request: ReqFunc, options?: ReqOptions): Promise<GatewayPermission.GatewayPermissionApplicationGetResponse> {
    const path = '/v1/permission/getApplication';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayPermission.GatewayPermissionApplicationGetResponse;
  }

  export async function permissionApiApplicationEdit(body: GatewayPermission.GatewayPermissionApplicationEditRequest, request: ReqFunc, options?: ReqOptions): Promise<GatewayPermission.GatewayPermissionApplicationEditResponse> {
    const path = '/v1/permission/editApplication';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayPermission.GatewayPermissionApplicationEditResponse;
  }

  export async function permissionApiApplicationFunctionAdd(body: GatewayPermission.GatewayPermissionApplicationFunctionAddRequest, request: ReqFunc, options?: ReqOptions): Promise<GatewayPermission.GatewayPermissionApplicationFunctionAddResponse> {
    const path = '/v1/permission/addApplicationFunction';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayPermission.GatewayPermissionApplicationFunctionAddResponse;
  }

  export async function permissionApiApplicationFunctionEdit(body: GatewayPermission.GatewayPermissionApplicationFunctionEditRequest, request: ReqFunc, options?: ReqOptions): Promise<GatewayPermission.GatewayPermissionApplicationFunctionEditResponse> {
    const path = '/v1/permission/editApplicationFunction';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayPermission.GatewayPermissionApplicationFunctionEditResponse;
  }

  export async function permissionApiApplicationFunctionMove(body: GatewayPermission.GatewayPermissionApplicationFunctionMoveRequest, request: ReqFunc, options?: ReqOptions): Promise<GatewayPermission.GatewayPermissionApplicationFunctionMoveResponse> {
    const path = '/v1/permission/moveApplicationFunction';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayPermission.GatewayPermissionApplicationFunctionMoveResponse;
  }

  export async function permissionApiApplicationFunctionEnableOrDisable(body: GatewayPermission.GatewayPermissionApplicationFunctionEnableOrDisableRequest, request: ReqFunc, options?: ReqOptions): Promise<GatewayPermission.GatewayPermissionApplicationFunctionEnableOrDisableResponse> {
    const path = '/v1/permission/enableOrDisableApplicationFunction';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayPermission.GatewayPermissionApplicationFunctionEnableOrDisableResponse;
  }

  export async function permissionApiApplicationEnableOrDisable(body: GatewayPermission.GatewayPermissionApplicationEnableOrDisableRequest, request: ReqFunc, options?: ReqOptions): Promise<GatewayPermission.GatewayPermissionApplicationEnableOrDisableResponse> {
    const path = '/v1/permission/enableOrDisableApplication';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayPermission.GatewayPermissionApplicationEnableOrDisableResponse;
  }

  export async function permissionApiApplicationKeyEdit(body: GatewayPermission.GatewayPermissionApplicationKeyEditRequest, request: ReqFunc, options?: ReqOptions): Promise<GatewayPermission.GatewayPermissionApplicationKeyEditResponse> {
    const path = '/v1/permission/editKeyApplication';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayPermission.GatewayPermissionApplicationKeyEditResponse;
  }

  export async function permissionApiApplicationKeyGet(body: GatewayPermission.GatewayPermissionApplicationKeyGetRequest, request: ReqFunc, options?: ReqOptions): Promise<GatewayPermission.GatewayPermissionApplicationKeyGetResponse> {
    const path = '/v1/permission/getKeyApplication';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayPermission.GatewayPermissionApplicationKeyGetResponse;
  }

  export async function permissionApiApplicationTypeGet(body: GatewayPermission.GatewayPermissionApplicationTypeGetRequest, request: ReqFunc, options?: ReqOptions): Promise<GatewayPermission.GatewayPermissionApplicationTypeGetResponse> {
    const path = '/v1/permission/getApplicationType';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayPermission.GatewayPermissionApplicationTypeGetResponse;
  }

  export async function permissionApiApplicationFunctionListGet(body: GatewayPermission.GatewayPermissionApplicationFunctionListGetRequest, request: ReqFunc, options?: ReqOptions): Promise<GatewayPermission.GatewayPermissionApplicationFunctionListGetResponse> {
    const path = '/v1/permission/getApplicationFunctionList';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayPermission.GatewayPermissionApplicationFunctionListGetResponse;
  }

  export async function permissionApiApplicationFunctionListUpdate(body: GatewayPermission.GatewayPermissionApplicationFunctionListUpdateRequest, request: ReqFunc, options?: ReqOptions): Promise<GatewayPermission.GatewayPermissionApplicationFunctionListUpdateResponse> {
    const path = '/v1/permission/updateApplicationFunctionList';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayPermission.GatewayPermissionApplicationFunctionListUpdateResponse;
  }

  export async function permissionApiGetUserGroupList(body: GatewayPermission.GatewayPermissionUserGroupListGetRequest, request: ReqFunc, options?: ReqOptions): Promise<GatewayPermission.GatewayPermissionUserGroupListGetResponse> {
    const path = '/v1/permission/getUserGroupList';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayPermission.GatewayPermissionUserGroupListGetResponse;
  }

  export async function permissionApiGetApplicationList(body: GatewayPermission.GatewayPermissionApplicationListGetRequest, request: ReqFunc, options?: ReqOptions): Promise<GatewayPermission.GatewayPermissionApplicationListByTypeGetResponse> {
    const path = '/v1/permission/getAppList';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayPermission.GatewayPermissionApplicationListByTypeGetResponse;
  }

  export async function permissionApiAddUserGroup(body: GatewayPermission.GatewayPermissionUserGroupAddRequest, request: ReqFunc, options?: ReqOptions): Promise<GatewayPermission.GatewayPermissionUserGroupAddResponse> {
    const path = '/v1/permission/addUserGroup';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayPermission.GatewayPermissionUserGroupAddResponse;
  }

  export async function permissionApiRemoveUserGroup(body: GatewayPermission.GatewayPermissionUserGroupRemoveRequest, request: ReqFunc, options?: ReqOptions): Promise<GatewayPermission.GatewayPermissionUserGroupRemoveResponse> {
    const path = '/v1/permission/removeUserGroup';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayPermission.GatewayPermissionUserGroupRemoveResponse;
  }

  export async function permissionApiDisableUserGroup(body: GatewayPermission.GatewayPermissionUserGroupDisableRequest, request: ReqFunc, options?: ReqOptions): Promise<GatewayPermission.GatewayPermissionUserGroupDisableResponse> {
    const path = '/v1/permission/disableUserGroup';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayPermission.GatewayPermissionUserGroupDisableResponse;
  }

  export async function permissionApiGetUserGroupsOfUser(body: GatewayPermission.GatewayPermissionUserGroupsOfUserGetRequest, request: ReqFunc, options?: ReqOptions): Promise<GatewayPermission.GatewayPermissionUserGroupsOfUserGetResponse> {
    const path = '/v1/permission/getUserGroupOfUser';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayPermission.GatewayPermissionUserGroupsOfUserGetResponse;
  }

  export async function permissionApiGameAdminListGet(body: GatewayPermission.GatewayGameAdminListGetRequest, request: ReqFunc, options?: ReqOptions): Promise<GatewayPermission.GatewayGameAdminListGetResponse> {
    const path = '/v1/permission/getGameAdminList';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayPermission.GatewayGameAdminListGetResponse;
  }

  export async function permissionApiUserPermissionGet(body: GatewayPermission.GatewayUserPermissionGetRequest, request: ReqFunc, options?: ReqOptions): Promise<GatewayPermission.GatewayUserPermissionGetResponse> {
    const path = '/v1/permission/getUserPermission';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayPermission.GatewayUserPermissionGetResponse;
  }

  export async function permissionApiGetGameList(body: GatewayPermission.GatewayPermissionGameListGetRequest, request: ReqFunc, options?: ReqOptions): Promise<GatewayPermission.GatewayPermissionGameListGetResponse> {
    const path = '/v1/permission/GetGameList';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayPermission.GatewayPermissionGameListGetResponse;
  }

  export async function permissionApiGetGameInfoList(body: GatewayPermission.GatewayPermissionGameInfoListGetRequest, request: ReqFunc, options?: ReqOptions): Promise<GatewayPermission.GatewayPermissionGameInfoListGetResponse> {
    const path = '/v1/permission/GetGameInfoList';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayPermission.GatewayPermissionGameInfoListGetResponse;
  }

  export async function permissionApiGetAccountManagementUserList(body: GatewayPermission.GatewayUserAccountManagementUserListGetRequest, request: ReqFunc, options?: ReqOptions): Promise<GatewayPermission.GatewayUserAccountManagementUserListGetResponse> {
    const path = '/v1/permission/getAccountManagementUserList';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayPermission.GatewayUserAccountManagementUserListGetResponse;
  }

  export async function gatewayAuthPageGet(body: GatewayPermission.GatewayAuthPageGetRequest, request: ReqFunc, options?: ReqOptions): Promise<GatewayPermission.GatewayAuthPageGetResponse> {
    const path = '/v1/permission/getAuthPage';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayPermission.GatewayAuthPageGetResponse;
  }

  export async function gatewayPermissionGameAuthListGet(body: GatewayPermission.GatewayPermissionGameAuthListGetRequest, request: ReqFunc, options?: ReqOptions): Promise<GatewayPermission.GatewayPermissionGameAuthListGetResponse> {
    const path = '/v1/permission/getGameAuthList';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayPermission.GatewayPermissionGameAuthListGetResponse;
  }

  export async function gatewayPermissionGameAdd(body: GatewayPermission.GatewayPermissionGameAddRequest, request: ReqFunc, options?: ReqOptions): Promise<GatewayPermission.GatewayPermissionGameAddResponse> {
    const path = '/v1/permission/addGame';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayPermission.GatewayPermissionGameAddResponse;
  }

  export async function permissionUserGroupRelationGet(body: GatewayPermission.GatewayUserGroupRelationGetRequest, request: ReqFunc, options?: ReqOptions): Promise<GatewayPermission.GatewayUserGroupRelationGetResponse> {
    const path = '/v1/permission/GetUserGroupRelation';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayPermission.GatewayUserGroupRelationGetResponse;
  }

  export async function permissionUserGroupRelationSet(body: GatewayPermission.GatewayUserGroupRelationSetRequest, request: ReqFunc, options?: ReqOptions): Promise<GatewayPermission.GatewayUserGroupRelationSetResponse> {
    const path = '/v1/permission/SetUserGroupRelation';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayPermission.GatewayUserGroupRelationSetResponse;
  }

  export async function userApiSystemTime(body: GatewayUser.GatewaySystemTimeRequest, request: ReqFunc, options?: ReqOptions): Promise<GatewayUser.GatewaySystemTimeResponse> {
    const path = '/v1/user/systemTime';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayUser.GatewaySystemTimeResponse;
  }

  export async function userApiLogout(body: GatewayUser.GatewayUserLogoutRequest, request: ReqFunc, options?: ReqOptions): Promise<GatewayUser.GatewayUserLogoutResponse> {
    const path = '/v1/user/logout';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayUser.GatewayUserLogoutResponse;
  }

  export async function userApiCheckTGC(body: GatewayUser.GatewayCheckTGCRequest, request: ReqFunc, options?: ReqOptions): Promise<GatewayUser.GatewayCheckTGCResponse> {
    const path = '/v1/user/checkTGC';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayUser.GatewayCheckTGCResponse;
  }

  export async function userApiLogin(body: GatewayUser.GatewayLoginRequest, request: ReqFunc, options?: ReqOptions): Promise<GatewayUser.GatewayLoginOrRegisterResponse> {
    const path = '/v1/user/login';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayUser.GatewayLoginOrRegisterResponse;
  }

  export async function userApiRegister(body: GatewayUser.GatewayRegisterRequest, request: ReqFunc, options?: ReqOptions): Promise<GatewayUser.GatewayLoginOrRegisterResponse> {
    const path = '/v1/user/register';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayUser.GatewayLoginOrRegisterResponse;
  }

  export async function userApiCheckST(body: GatewayUser.GatewayCheckSTRequest, request: ReqFunc, options?: ReqOptions): Promise<GatewayUser.GatewayCheckSTResponse> {
    const path = '/v1/user/checkST';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayUser.GatewayCheckSTResponse;
  }

  export async function userApiOrganizationGet(body: GatewayUser.GatewayOrganizationGetRequest, request: ReqFunc, options?: ReqOptions): Promise<GatewayUser.GatewayOrganizationGetResponse> {
    const path = '/v1/user/getOrganization';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayUser.GatewayOrganizationGetResponse;
  }

  export async function userApiGetUserInfo(body: GatewayUser.GetwayGetUserInfoRequest, request: ReqFunc, options?: ReqOptions): Promise<GatewayUser.GetwayGetUserInfoResponse> {
    const path = '/v1/user/info';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayUser.GetwayGetUserInfoResponse;
  }

  export async function userApiUpdateUserStatus(body: GatewayUser.GatewayUserStatusUpdateRequest, request: ReqFunc, options?: ReqOptions): Promise<GatewayUser.GatewayUserStatusUpdateResponse> {
    const path = '/v1/user/updateUserStatus';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayUser.GatewayUserStatusUpdateResponse;
  }

  export async function userApiSendCodeToEmail(body: GatewayUser.GatewayCodeToEmailSendRequest, request: ReqFunc, options?: ReqOptions): Promise<GatewayUser.GatewayCodeToEmailSendResponse> {
    const path = '/v1/user/sendCodeToEmail';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayUser.GatewayCodeToEmailSendResponse;
  }

  export async function userApiCheckEmailCode(body: GatewayUser.GatewayEmailCodeCheckRequest, request: ReqFunc, options?: ReqOptions): Promise<GatewayUser.GatewayEmailCodeCheckResponse> {
    const path = '/v1/user/checkEmailCode';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayUser.GatewayEmailCodeCheckResponse;
  }

  export async function userApiForgetPassword(body: GatewayUser.GatewayPasswordForgetRequest, request: ReqFunc, options?: ReqOptions): Promise<GatewayUser.GatewayPasswordForgetResponse> {
    const path = '/v1/user/forgetPassword';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayUser.GatewayPasswordForgetResponse;
  }

  export async function userApiChangePassword(body: GatewayUser.GatewayPasswordChangeRequest, request: ReqFunc, options?: ReqOptions): Promise<GatewayUser.GatewayPasswordChangeResponse> {
    const path = '/v1/user/changePassword';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayUser.GatewayPasswordChangeResponse;
  }

  export async function userApiUpdateGame4usUserInfo(body: GatewayUser.GatewayGame4usUserInfoUpdateRequest, request: ReqFunc, options?: ReqOptions): Promise<GatewayUser.GatewayGame4usUserInfoUpdateResponse> {
    const path = '/v1/user/updateGame4usUserInfo';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayUser.GatewayGame4usUserInfoUpdateResponse;
  }

  export async function userApiGetSecurityInfo(body: GatewayUser.GatewaySecurityInfoGetRequest, request: ReqFunc, options?: ReqOptions): Promise<GatewayUser.GatewaySecurityInfoGetResponse> {
    const path = '/v1/user/getSecurityInfo';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayUser.GatewaySecurityInfoGetResponse;
  }

  export async function userApiBindSecurityMail(body: GatewayUser.GatewaySecurityMailBindRequest, request: ReqFunc, options?: ReqOptions): Promise<GatewayUser.GatewaySecurityMailBindResponse> {
    const path = '/v1/user/bindSecurityMail';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayUser.GatewaySecurityMailBindResponse;
  }

  export async function userApiConfirmBindMail(body: GatewayUser.GatewayBindMailConfirmRequest, request: ReqFunc, options?: ReqOptions): Promise<GatewayUser.GatewayBindMailConfirmResponse> {
    const path = '/v1/user/confirmBindMail';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayUser.GatewayBindMailConfirmResponse;
  }

  export async function userApiGetThirdBindState(body: GatewayUser.GatewayThirdBindStateGetRequest, request: ReqFunc, options?: ReqOptions): Promise<GatewayUser.GatewayThirdBindStateGetResponse> {
    const path = '/v1/user/getThirdBindState';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayUser.GatewayThirdBindStateGetResponse;
  }

  export async function userApiThirdAccountLogin(body: GatewayUser.GatewayLoginThirdAccountRequest, request: ReqFunc, options?: ReqOptions): Promise<GatewayUser.GatewayLoginOrRegisterResponse> {
    const path = '/v1/user/thirdAccountLogin';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayUser.GatewayLoginOrRegisterResponse;
  }

  export async function userApiBindThirdAccount(body: GatewayUser.GatewayThirdAccountBindRequest, request: ReqFunc, options?: ReqOptions): Promise<GatewayUser.GatewayThirdAccountBindResponse> {
    const path = '/v1/user/bindThirdAccount';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayUser.GatewayThirdAccountBindResponse;
  }

  export async function userApiUnbindThirdAccount(body: GatewayUser.GatewayThirdAccountUnbindRequest, request: ReqFunc, options?: ReqOptions): Promise<GatewayUser.GatewayThirdAccountUnbindResponse> {
    const path = '/v1/user/unbindThirdAccount';
    const requestOptions: ReqOptions = Object.assign({}, defaultOptions, options, { body: JSON.stringify(body) });
    return await request(path, requestOptions) as GatewayUser.GatewayThirdAccountUnbindResponse;
  }
}
