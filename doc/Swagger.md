# Proto => Swagger http rules

============

## 1. 相关说明
### 1.1 文档说明
该文档是用来描述如何使用第三方插件，将添加了部分第三方定义的protobuf定义文件转换为swagger配置文件，以及这种转换过程中的一些规则。

### 1.2 参数说明 
请求参数：

* GET：在 http 请求中，通过 url 中携带字段，eg：?column1=value1&column2=value2。
* POST：在 http 请求中，通过 x-www-form-urlencoded 的 body 中携带的字段。

## 2 结构定义

### 2.1 message
通过在 proto 文件中定义 message ，message 是一种数据模型。

范例如下：
~~~
message MessageRequest {
    int64 id = 1;
}
~~~

> 范例解释：请求中携带 id 字段，类型为 int64。

### 2.2 service
通过在 proto 文件中定义 service ，service 中通过 rpc method 创建 rpc 接口。
一个最简单的 rpc 接口需要接受一个`请求模型`，并返回一个`结果模型`，`请求模型`与`结果模型`都是 message 。

范例如下：
~~~
service demoService {
    rpc GetOrder (MessageRequest) returns (Response) {}
}
~~~

> 范例解释：MessageRequest 为`请求模型`，Response 为`结果模型`

### 2.3 http service
定义一个 HTTP REST APIs 的 service ，需要`import "google/api/annotations.proto";`。并在创建的 service 内，使用 option 方法，将 google.api.http 插件加载进来。

通过设置 option(google.api.http) 的属性确定是使用 GET 或 POST 或 PUT 或 DELETE 或 PATCH 方法访问 HTTP REST APIs。

> 注: 虽然 http service 使用的不是 rpc 接口，而是 http 接口，但该定义依然是 rpc method。

范例如下：
~~~
import "google/api/annotations.proto";

service demoService {
    rpc demo (MessageRequest) returns (Response) {
        option (google.api.http) = {
            post: "/v1/demo"
            body: "*"
        };
    }
}
~~~

> 范例解释：定义一个通过 POST 方法访问的路由`/v1/demo`。

### 2.4 举例
创建一个名为 demo.proto 的完整例子

~~~
syntax = "proto3";

import "google/api/annotations.proto";

package demo;

message MessageRequest {
    int64 id = 1;
    int64 flag = 2;
}
message Response {
    string name = 1;
}

// gRPC gateway
service demoService {
    rpc demo (MessageRequest) returns (Response) {
        option (google.api.http) = {
            post: "/v1/demo/{flag}",
            body: "*"
        };
    }
}
~~~

## 3 HTTP RULE
`HTTP RULE` 将 rpc method 映射为一个或多个 HTTP REST APIs，映射决定了 rpc method 的`请求模型`中哪些部分来自请求消息中的 path，query parameters 或者 POST 请求中的 body。

> 注：下面所有例子，都是由客户端通过 HTTP 请求访问 HTTP REST API。

### 3.1 GET 方法

#### 3.1.1 GET Path

范例如下：
~~~
service Messaging {
    rpc GetMessage (GetMessageRequest) returns (Message) {
        option (google.api.http) = {
            get: "/v1/messages/{message_id}/{sub.subfield}"
        };
    }
}
message GetMessageRequest {
    message SubMessage {
        string subfield = 1;
    }
    string message_id = 1; // mapped to the URL
    SubMessage sub = 2;    // `sub.subfield` is url-mapped
}
message Message {
    string text = 1; // content of the resource
}
~~~

通过上面的范例，我们可以得到如下结果：
* `GET /v1/messages/{message_id}/{sub.subfield}`
    * HTTP: `GET /v1/messages/123456/foo`
    * REQUEST: `{"message_id": "123456", "sub": {"subfield": "foo"}}`

#### 3.1.2 GET Query Parameters

如果没有在 path 中找到`请求模型`中的字段，可以通过在 query parameters 中获得。

如下例，根据 3.1.1，在 message 的 GetMessageRequest 中增加了字段 revision。

~~~
service Messaging {
    rpc GetMessage (GetMessageRequest) returns (Message) {
        option (google.api.http) = {
            get: "/v1/messages/{message_id}/{sub.subfield}"
        };
    }
}
message GetMessageRequest {
    message SubMessage {
        string subfield = 1;
    }
    string message_id = 1; // mapped to the URL
    int64 revision = 2;    // becomes a parameter
    SubMessage sub = 3;    // `sub.subfield` is url-mapped
}
message Message {
    string text = 1; // content of the resource
}
~~~

通过上面的范例，我们可以得到如下的 url 参数的映射结果：
* `GET /v1/messages/{message_id}/{sub.subfield}`
    * HTTP: `GET /v1/messages/123456/foo?revision=2`
    * REQUEST: `{"message_id": "123456", "revision": 2, "sub": {"subfield": "foo"}}`

#### 3.1.3 additional_bindings 追加绑定

可以通过在 options 中增加 additional_bindings 参数来绑定多个 HTTP REST APIs。

~~~
service Messaging {
    rpc GetMessage (GetMessageRequest) returns (Message) {
        option (google.api.http) = {
            get: "/v1/messages/{message_id}"
            additional_bindings {
                get: "/v1/users/{user_id}/messages/{message_id}"
            }
        };
    }
}
message GetMessageRequest {
    string message_id = 1;
    string user_id = 2;
}
message Message {
    string text = 1; // content of the resource
}
~~~

通过上面的范例，我们可以得到如下的结果

* `GET /v1/messages/{message_id}/{sub.subfield}`
    * HTTP: `POST /v1/messages/123456`
    * REQUEST: `{"message_id": "123456"}`

* `GET /v1/messages/{message_id}/{sub.subfield}`
    * HTTP: `POST /v1/users/me/messages/123456`
    * REQUEST: `{"user_id": "me", "message_id": "123456"}`

### 3.2 POST 方法

#### 3.2.1 POST body

通过设置 body 的参数，指定 POST 请求中的所有数据属于`请求模型`中的哪个字段。

范例如下：
~~~
service Messaging {
    rpc GetMessage (UpdateMessageRequest) returns (Message) {
        option (google.api.http) = {
            post: "/v1/messages/{message_id}"
            body: "content"
        };
    }
}
message UpdateMessageRequest {
    string message_id = 1; // mapped to the URL
    Content content = 2;   // mapped to the body
    boolean hidden_column = 3;   // hidden column
}
message Content {
    string text = 1; // content of the resource
}
message Message {
    string text = 1;
}
~~~

通过上面的范例，我们可以得到如下的结果:

* `POST /v1/messages/{message_id}`
    * HTTP: `POST /v1/messages/123456 { "text": "Hi!" }`
    * REQUEST: `{"message_id": "123456", "content": {"text": "Hi!"}}`

其中 UpdateMessageRequest 的 hidden_column 字段由于未在 HTTP 请求中进行映射，所以在结果中不存在。

#### 3.2.2 POST body: "*"
通过设置 body: "*"，将 POST 请求中字段，按字段名映射到`请求模型`中，如果`请求模型`中不存在，则丢弃。

范例如下：
~~~
service Messaging {
    rpc GetMessage (UpdateMessageRequest) returns (Message) {
        option (google.api.http) = {
            post: "/v1/messages/{message_id}"
            body: "*"
        };
    }
}
message UpdateMessageRequest {
    string message_id = 1;
    Content content = 2;   // mapped to the body
}
message Content {
    string text = 1; // content of the resource
}
message Message {
    string text = 1;
}
~~~

通过上面的范例，我们可以得到如下的结果

* `POST /v1/messages/{message_id}`
    * HTTP: `POST /v1/messages/123456 { "content": {"text": "Hi!"}, "hidden_column": true }`
    * REQUEST: `{"message_id": "123456", "content": {"text": "Hi!"}}`

## 4 可选，必选

proto 从 v3 版本后，就废弃了 message 字段中使用 optional 和 required 关键字设定字段是否可选项，而是默认全部字段都是可选，如果在正常业务中，需要将字段设定为必选，可以在 proto 文件转译成 swagger.json 后，可以手动在字段设定中添加`required`字段，并且值为`true`

范例如下：
~~~
{
    ...,
    "definitions": {
        "UpdateMessageRequest": {
          "type": "object",
          "properties": {
            "message_id": {
              "type": "string",
              "format": "int64",
              "required": true      // add required property
            },
            "hidden_column": {
              "type": "boolean",
              "format": "boolean"
            },
          }
        }
    }
}
~~~