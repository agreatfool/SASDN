
# 接口文档

[TOC]


## 1. DemoApiService
    

    

### GetDemoOrderApi   
   
**简要描述：**

- This is GetDemoOrderApi Description

**请求Router:**
- ` /v1/getDemoOrder `

**请求方式：**
- POST


**请求参数说明：**

|参数名|必选|类型|默认值|说明|
|:---|:---|:---|:---|:---|
|paramInt64|必传|Int64|---|This is param_int64 Description|
|paramInt32|必传|Int32|---|This is param_int32 Description|
|paramBool|可传|Bool|false|This is param_bool Description|
|paramString|可传|String|"string"|This is param_string Description|



**参数示例**

```
{
  "paramInt64": 0,
  "paramInt32": 0,
  "paramBool": false,
  "paramString": "string"
}
```
    


**返回参数说明：**

|参数名|类型|说明|
|:---|:---|:---|
|orderId|Int64|This is order_id Description|
|userId|String|This is user_id Description|
|price|String|This is price Description|
|ispayed|Bool|This is ispayed Description|
|items|Map< Int64, String >|无|



**参数示例**

```
{
  "orderId": 0,
  "userId": "",
  "price": "",
  "ispayed": false,
  "items": ""
}
```
    

    
    
    