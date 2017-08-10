# Proto => Swagger http rules

============

## 基本定义
通过在 proto 中指定 google.api.http 选项来定义 RPC 到 HTTP REST APIs的映射，这个映射决定了APIs的请求是什么样子的。
通过填充 message 结构来定义查询参数，或HTTP请求的body格式。 

文件名：demo.proto 
~~~
syntax = "proto3";

import "google/api/annotations.proto";

package demo;

message MessageRequest {
    int64 id = 1;
}
message Response {
    string name = 1;
}

// gPRC-getway Test
service demoService {
    rpc demo (MessageRequest) returns (Response) {
        option (google.api.http) = {
            post: "/v1/demo"
            body: "*"
        };
    }
}
~~~

上述 demo.proto 通过 sasdn proto -s 命令生成 Swagger 文件

文件名：demo.swagger.json
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

## HTTP映射规则
* 将HTTP路径、查询参数和正文字段映射到请求消息的规则如下:
1. body字段指定或字段路径，或省略。如果省略了，它假定没有HTTP主体。
2. body字段的leaf field(请求中的嵌套消息的递归扩展)可以分为三种类型:
    * (a) 在URL模板中匹配。
    * (b) 通过 body 覆盖 (如果 body 是 `*`，除了(a)以外，所有在 body 下的所有字段)
    * (c) 所有其他字段
3. 在HTTP请求中找到的URL查询参数被映射到(2.c)代表的字段。
4. 任何需要POST, PUT, PATCH等发送出去的字段，都只能包含在HTTP请求的主体中，也就是(2.b)代表的字段。

### GET 方法
~~~
service Messaging {
    rpc GetMessage (GetMessageRequest) returns (Message) {
        option (google.api.http) = {
            get: "/v1/messages/{message_id}/{sub.subfield}"
        };
    }
}
message Message {
    string text = 1; // content of the resource
}
~~~

1. GET Path Params
~~~
message GetMessageRequest {
    message SubMessage {
        string subfield = 1;
    }
    string message_id = 1; // mapped to the URL
    SubMessage sub = 2;    // `sub.subfield` is url-mapped
}
~~~
* HTTP: `GET /v1/messages/123456/foo`
* RPC: `GetMessage(message_id: "123456" sub: SubMessage(subfield: "foo"))`

2. GET Path Query
~~~
message GetMessageRequest {
    message SubMessage {
        string subfield = 1;
    }
    string message_id = 1; // mapped to the URL
    int64 revision = 2;    // becomes a parameter
    SubMessage sub = 3;    // `sub.subfield` is url-mapped
}
~~~
* HTTP: `GET /v1/messages/123456?revision=2&sub.subfield=foo` 
* RPC: `GetMessage(message_id: "123456" revision: 2 sub: SubMessage(subfield: "foo"))`

3. GET additional_bindings
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
~~~

* HTTP: `POST /v1/messages/123456`
* RPC: `GetMessage(message_id: "123456")`

* HTTP: `POST /v1/users/me/messages/123456`
* RPC: `GetMessage(user_id: "me" message_id: "123456")`

### POST 方法
1. POST body `UpdateMessageRequest.message`
~~~
service Messaging {
    rpc GetMessage (UpdateMessageRequest) returns (Message) {
        option (google.api.http) = {
            post: "/v1/messages/{message_id}"
            body: "message"
        };
    }
}
message Message {
    string text = 1; // content of the resource
}
message UpdateMessageRequest {
    string message_id = 1; // mapped to the URL
    Message message = 2;   // mapped to the body
}
~~~
* HTTP: `POST /v1/messages/123456 { "text": "Hi!" }` 
* RPC: `UpdateMessage(message_id: "123456" message { text: "Hi!" })`

2. POST body *
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
* HTTP: `POST /v1/messages/123456 { "text": "Hi!" }` 
* RPC: `UpdateMessage(message_id: "123456", text: "Hi!")`