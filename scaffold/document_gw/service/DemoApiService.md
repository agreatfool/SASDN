
## DemoApiService
    
[TOC]
    

### 1. GetDemoOrderApi   
   
**简要描述：**

- 无

**请求Router:**
- ` /v1/getDemoOrder `

**请求方式：**
- POST


**请求参数说明：**

|参数名|必选|类型|默认值|说明|
|:---|:---|:---|:---|:---|
|paramInt64|必传|Int64|---|无|
|paramInt32|必传|Int32|---|无|
|paramBool|可传|Bool|false|无|
|paramString|可传|String|"string"|无|



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
|orderId|Int64|无|
|userId|String|无|
|price|String|无|
|ispayed|Bool|无|
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
    

    
    