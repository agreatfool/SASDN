
## CommonApiService
    
[TOC]
    

### 1. Login   
   
**简要描述：**

- 后台用户登录

**请求Router:**
- ` /v1/common/login `

**请求方式：**
- POST


**请求结构说明：**

|参数名|必选|类型|默认值|说明|
|:---|:---|:---|:---|:---|
|timestamp|必传|Uint32|---|时间戳（10 位，精确到秒）|
|userName|必传|String|---|用户帐号|
|password|必传|String|---|用户密码|



**参数示例**

```
{
  "timestamp": 0,
  "userName": "",
  "password": ""
}
```
    


**返回结构说明：**

|参数名|类型|说明|
|:---|:---|:---|
|code|Int32|无|
|message|String|无|
|data|LoginData|无|


**LoginData数据格式描述：**

|字段名|类型|说明|
|:---|:---|:---|
|userId|Uint64|用户id|
|userName|String|用户账号|
|permissionAliasNameList|String|权限别名列表（json格式字符串，如['advManage', 'newsManage', 'guestBookManage', 'jobManage']）。权限：1.轮播管理: advManage，2.新闻管理: newsManage，3.留言管理: guestBookManage，4.招聘管理: jobManage|
|displayName|String|用户名称|
|jwt|String|Json Web Token|

    

**参数示例**

```
{
  "code": 0,
  "message": "",
  "data": {
    "userId": 0,
    "userName": "",
    "permissionAliasNameList": "",
    "displayName": "",
    "jwt": ""
  }
}
```
    

    
### 2. Logout   
   
**简要描述：**

- 后台用户登出

**请求Router:**
- ` /v1/common/logout `

**请求方式：**
- POST


**请求结构说明：**

|参数名|必选|类型|默认值|说明|
|:---|:---|:---|:---|:---|
|timestamp|必传|Uint32|---|时间戳（10 位，精确到秒）|



**参数示例**

```
{
  "timestamp": 0
}
```
    


**返回结构说明：**

|参数名|类型|说明|
|:---|:---|:---|
|code|Int32|无|
|message|String|无|



**参数示例**

```
{
  "code": 0,
  "message": ""
}
```
    

    
### 3. GetUploadingUrl   
   
**简要描述：**

- 获取上传文件 url

**请求Router:**
- ` /v1/common/getUploadingUrl `

**请求方式：**
- POST


**请求结构说明：**

|参数名|必选|类型|默认值|说明|
|:---|:---|:---|:---|:---|
|timestamp|必传|Uint32|---|时间戳（10 位，精确到秒）|
|fileName|必传|String|---|文件名|



**参数示例**

```
{
  "timestamp": 0,
  "fileName": ""
}
```
    


**返回结构说明：**

|参数名|类型|说明|
|:---|:---|:---|
|code|Uint32|无|
|message|String|无|
|data|UploadingUrl|无|


**UploadingUrl数据格式描述：**

|字段名|类型|说明|
|:---|:---|:---|
|uploadingUrl|String|上传的url|

    

**参数示例**

```
{
  "code": 0,
  "message": "",
  "data": {
    "uploadingUrl": ""
  }
}
```
    

    
### 4. KickOffUser   
   
**简要描述：**

- 强制踢人下线

**请求Router:**
- ` /common `

**请求方式：**
- POST


**请求结构说明：**

|参数名|必选|类型|默认值|说明|
|:---|:---|:---|:---|:---|
|userIdList|可传|Array< Uint64 >|0|用户id列表|
|type|必传|Uint32|---|登出类型|



**参数示例**

```
{
  "userId": [
    0
  ],
  "type": 0
}
```
    


**返回结构说明：**

|参数名|类型|说明|
|:---|:---|:---|
|code|Uint32|无|
|message|String|无|



**参数示例**

```
{
  "code": 0,
  "message": ""
}
```
    

    
    