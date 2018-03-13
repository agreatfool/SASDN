
## DemoService

[TOC]


### 1. GetDemoOrder   

**简要描述：**

- This is GetDemoOrder Description

**请求方法:**
- ` getDemoOrder `

**请求方式：**
- RPC


**请求结构说明：**

|参数名|类型|说明|
|:---|:---|:---|
|orderId|可传|Int64|0|This is GetDemoOrderRequest Description|



**参数示例**

```
{
  "orderId": 0
}
```



**返回结构说明：**

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


​    
​    