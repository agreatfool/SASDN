# Proto => Swagger http rules

============

## 名词解释
* 查询参数分两种：
    * GET，在 http 请求中，通过 url 中携带的字段，eg：?column1=value1&column2=value2。
    * POST，在 http 请求中，通过 x-www-form-urlencoded 的 body 中携带的字段。

## 结构定义

### message 结构体
通过在 proto 文件中定义 message 结构体来定义查询参数。

> 定义解释：请求中携带 id 字段，类型为 int64。

~~~
message MessageRequest {
    int64 id = 1;
}
~~~

### service 结构体
通过在 proto 文件中定义 service 结构体，并使用 option(google.api.http) = {} 语法来定义路由接口，该定义决定 proto 定义到 HTTP REST APIs 的映射。

> 定义解释：允许通过 post 请求 /v1/demo 路由。

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

### 举例
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

### swagger.json
通过 sasdn proto -p ./demo.proto -i ./google -s 解析 demo.proto 文件，可以生成 swagger 的接口定义文件，文件类型是 json，范例如下：

~~~
{
  "swagger": "2.0",
  "info": {
    "title": "demo.proto",
    "version": "version not set"
  },
  "schemes": [
    "http",
    "https"
  ],
  "consumes": [
    "application/json"
  ],
  "produces": [
    "application/json"
  ],
  "paths": {
    "/v1/demo": {
      "post": {
        "operationId": "demo",
        "responses": {
          "200": {
            "description": "",
            "schema": {
              "$ref": "#/definitions/demoResponse"
            }
          }
        },
        "parameters": [
          {
            "name": "flag",
            "in": "path",
            "required": true,
            "type": "string",
            "format": "int64"
          },
          {
            "name": "body",
            "in": "body",
            "required": true,
            "schema": {
              "$ref": "#/definitions/demoMessageRequest"
            }
          }
        ],
        "tags": [
          "demoService"
        ]
      }
    }
  },
  "definitions": {
    "demoMessageRequest": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string",
          "format": "int64"
        }
      }
    },
    "demoResponse": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string"
        }
      }
    }
  }
}
~~~

## 映射规则

### GET 方法

通过 GET Path 定义 http => rpc 映射关系：
* HTTP: `GET /v1/messages/123456/foo`
* RPC: `GetMessage(message_id: "123456" sub: SubMessage(subfield: "foo"))`

根据上述映射关系，定义的 proto 文件如下：

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


通过 GET Path Query 定义 http => rpc 映射关系：
* HTTP: `GET /v1/messages/123456?revision=2&sub.subfield=foo`
* RPC: `GetMessage(message_id: "123456" revision: 2 sub: SubMessage(subfield: "foo"))`

根据上述映射关系，定义的 proto 文件如下：

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


通过 additional_bindings 参数追加 http => rpc 映射关系：

* HTTP: `POST /v1/messages/123456`
* RPC: `GetMessage(message_id: "123456")`

* HTTP: `POST /v1/users/me/messages/123456`
* RPC: `GetMessage(user_id: "me" message_id: "123456")`

根据上述映射关系，定义的 proto 文件如下：

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

### POST 方法

通过 POST body 字段定义 http => rpc 映射关系：
* HTTP: `POST /v1/messages/123456 { "text": "Hi!" }`
* RPC: `UpdateMessage(message_id: "123456" message { text: "Hi!" })`

根据上述映射关系，定义的 proto 文件如下：

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


通过 POST body: "*" 字段定义 http => rpc 映射关系：
* HTTP: `POST /v1/messages/123456 { "text": "Hi!" }`
* RPC: `UpdateMessage(message_id: "123456", text: "Hi!")`

根据上述映射关系，定义的 proto 文件如下：

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
