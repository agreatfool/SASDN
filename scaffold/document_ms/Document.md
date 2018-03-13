
# 接口文档

[TOC]


## 1. DemoService


​    

### GetDemoOrder   

**简要描述：**

- 无

**请求方法:**
- ` getDemoOrder `

**请求方式：**
- RPC


**请求参数说明：**

|参数名|类型|说明|
|:---|:---|:---|
|orderId|可传|Int64|0|无|



**参数示例**

```
{
  "orderId": 0
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


​    
​    
​    