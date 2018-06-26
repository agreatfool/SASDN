
## DemoApiService
    
[TOC]
    

### 1. GetDemoOrderApi   
   
**简要描述：**

- This is GetDemoOrderApi Description

**请求Router:**
- ` /v1/getDemoOrder `

**请求方式：**
- POST


**请求结构说明：**

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
    


**返回结构说明：**

|参数名|类型|说明|
|:---|:---|:---|
|orderId|Int32|This is order_id Description|
|orderContent|String|This is order_content Description|



**参数示例**

```
{
  "orderId": 0,
  "orderContent": ""
}
```
    

    
    