# Proto => Swagger http rules

============

## 1 名词解释
* 查询参数分两种：
    * GET，在 http 请求中，通过 url 中携带的字段，eg：?column1=value1&column2=value2。
    * POST，在 http 请求中，通过 x-www-form-urlencoded 的 body 中携带的字段。

## 2 结构定义

### 2.1 message 结构体
通过在 proto 文件中定义 message 结构体来定义查询参数。

~~~
message MessageRequest {
    int64 id = 1;
}
~~~

> 定义解释：请求中携带 id 字段，类型为 int64。

### 2.2 service 结构体
通过在 proto 文件中定义 service 结构体，并使用 option(google.api.http) = {} 语法来定义路由接口，该定义决定 proto 定义到 HTTP REST APIs 的映射。

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

> 定义解释：允许通过 post 请求 /v1/demo 路由。

### 2.3 举例
创建一个名为 demo.proto 的完整例子

> 定义解释：允许通过 post 请求 /v1/demo 路由，请求中提交的 body 数据包含 id 字段，类型为 int64, 请求的 url 中包含 flag 字段，类型为 int64

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

## 3 映射规则

### 3.1 GET 方法

#### 3.1.1 GET Path 参数映射

绑定 GET 请求中的 url path 的参数与 rpc message 的字段的映射关系，范例如下：

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

通过上面的范例，我们可以得到如下的结果
* HTTP: `GET /v1/messages/123456/foo`
* RPC: `GetMessage(message_id: "123456" sub: SubMessage(subfield: "foo"))`

#### 3.1.2 GET PATH Query 参数映射

GET 请求中绑定了 url path 的参数与 rpc message 的字段的映射关系，但如果 url path 中缺少 message 的字段，则可以通过 url path query 获得。

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
* RPC: `GetMessage(message_id: "123456" revision: 2 sub: SubMessage(subfield: "foo"))`

#### 3.1.3 additional_bindings 追加绑定

通过 additional_bindings 参数追加映射关系：

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
* RPC: `GetMessage(message_id: "123456")`

* HTTP: `POST /v1/users/me/messages/123456`
* RPC: `GetMessage(user_id: "me" message_id: "123456")`

### 3.2 POST 方法

#### 3.2.1 POST body 参数映射

绑定 POST 请求中 body 数据中的字段与 rpc message 的字段的映射关系，范例如下：

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
* RPC: `UpdateMessage(message_id: "123456" message { text: "Hi!" })`

#### 3.2.2 POST body: "*" 参数映射

绑定 POST 请求中 body 数据字段为“*”时，与 rpc message 的字段的映射关系，范例如下：

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
* HTTP: `POST /v1/messages/123456 { "text": "Hi!" }`
* RPC: `UpdateMessage(message_id: "123456", text: "Hi!")`
