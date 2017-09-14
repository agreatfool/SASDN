# Proto => Swagger http rules

============

## 1 名词解释
* 请求参数：
    * GET，在 http 请求中，通过 url 中携带的字段，eg：?column1=value1&column2=value2。
    * POST，在 http 请求中，通过 x-www-form-urlencoded 的 body 中携带的字段。

## 2 结构定义

### 2.1 message 结构体
通过在 proto 文件中定义 message 结构体，message 结构体是一种数据模型。

范例如下：
~~~
message MessageRequest {
    int64 id = 1;
}
~~~

> 范例解释：请求中携带 id 字段，类型为 int64。

### 2.2 service 结构体
通过在 proto 文件中定义 service 结构体，service 结构体中通过 rpc method 创建 rpc 接口。
一个最简单的 rpc 接口需要接受一个`请求模型`，并返回一个`结果模型`，`请求模型`与`结果模型`都是 message 结构体。

范例如下：
~~~
service demoService {
    rpc GetOrder (MessageRequest) returns (Response) {}
}
~~~

> 范例解释：MessageRequest 为`请求模型`，Response 为`结果模型`

### 2.3 http service 结构体
定义一个 HTTP REST APIs 的 service 结构体，需要将 google.api.http 引入到 proto 文件内。并在创建的 service 结构体内，使用 option 方法，将 google.api.http 插件加载进来。

允许通过设置 option(google.api.http) 的属性，来确定是使用 GET 方法或者 POST 方法访问 HTTP REST APIs，目前支持 GET, POST, PUT, DELETE, PATCH 这五种方法访问 HTTP REST APIs

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

// gPRC-getway Test
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
* HTTP: `GET /v1/messages/123456/foo`
* RPC: `GetMessage(GetMessageRequest(message_id: "123456" sub: SubMessage(subfield: "foo")))`

#### 3.1.2 GET Query Parameters

如果没有在 path 中找到`请求模型`中的字段，可以通过在 query parameters 中获得。

如下例，根据 3.1.1，在 message 结构体 GetMessageRequest 中增加了字段 revision。

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
* HTTP: `GET /v1/messages/123456/foo?revision=2`
* RPC: `GetMessage(GetMessageRequest(message_id: "123456" revision: 2 sub: SubMessage(subfield: "foo")))`

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
* HTTP: `POST /v1/messages/123456`
* RPC: `GetMessage(GetMessageRequest(message_id: "123456"))`

* HTTP: `POST /v1/users/me/messages/123456`
* RPC: `GetMessage(GetMessageRequest(user_id: "me" message_id: "123456"))`

### 3.2 POST 方法

#### 3.2.1 POST body

通过设置 body 的参数，指定 POST 请求中的所有数据属于`请求模型`中的哪个字段。

范例如下：
~~~
service Messaging {
    rpc GetMessage (UpdateMessageRequest) returns (Message) {
        option (google.api.http) = {
            post: "/v1/messages/{message_id}"
            body: "message"
        };
    }
}
message UpdateMessageRequest {
    string message_id = 1; // mapped to the URL
    Message message = 2;   // mapped to the body
    boolean hidden_column = 3;   // hidden column
}
message Message {
    string text = 1; // content of the resource
}
~~~

通过上面的范例，我们可以得到如下的结果
* HTTP: `POST /v1/messages/123456 { "text": "Hi!" }`
* RPC: `UpdateMessage(UpdateMessageRequest(message_id: "123456" message { text: "Hi!" }))`

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
message Message {
    string text = 1;
}
message UpdateMessageRequest {
    string message_id = 1;
    string text = 2;
}
~~~

通过上面的范例，我们可以得到如下的结果
* HTTP: `POST /v1/messages/123456 { "text": "Hi!", "hidden_column": true }`
* RPC: `UpdateMessage(UpdateMessageRequest(message_id: "123456", text: "Hi!"))`
