# Protobuf <=> Swagger 转换指南

## 1. 说明
### 1.1 文档说明
该文档是用来说明在使用了第三方插件，将添加了部分第三方定义的protobuf定义文件转换为swagger配置文件后，其中定义转换的规则。

### 1.2 场景定义
下文中所有的例子，都是以一个使用转换出来的swagger配置文件运行的HTTP服务器（即Gateway），接受客户端提交HTTP请求的场景。

### 1.3 参数说明 
请求参数：

* GET：在 http 请求中，通过 url query string 来提交参数，eg：?column1=value1&column2=value2。
* POST：在 http 请求中，通过 x-www-form-urlencoded form 来提交参数。

### 1.4 Protobuf相关名词
#### 1.4.1 message
`message`是protobuf文件中对于数据模型的定义。

e.g：
```protobuf
message MessageRequest {
    int64 id = 1;
}
```

#### 1.4.2 service
`service`是protobuf中对于rpc服务的特殊定义，一个service中可以定义多个rpc方法，也就是多个HTTP RESTful接口。在当前的说明文档中，service都不作为rpc来解释，而是用来转换为swagger http请求定义的一种`语法`。

e.g：
```protobuf
service demoService {
    rpc GetOrder (MessageRequest) returns (Response) {}
}
```

#### 1.4.3 google.api.http
如果仅只是使用protobuf文件来制作rpc的定义，那就不需要额外引入第三方proto文件。但我们现在要做的事情是将rpc的接口定义转换为http的定义，这里就需要第三方的proto协助了。需要`import "google/api/annotations.proto";`。

e.g：
```protobuf
import "google/api/annotations.proto";

service demoService {
    rpc demo (MessageRequest) returns (Response) {
        option (google.api.http) = {
            post: "/v1/demo"
            body: "*"
        };
    }
}
```

#### 1.4.4 范例
```protobuf
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
```

## 2. 转换规则
### 2.1 HTTP GET
#### 2.1.1 GET URL Mapping
e.g：
```protobuf
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
```

说明：

* 匹配规则：`GET /v1/messages/{message_id}/{sub.subfield}`
* HTTP请求: `GET /v1/messages/123456/foo`
* Gateway获得的参数: `{"message_id": "123456", "sub": {"subfield": "foo"}}`

#### 2.1.2 GET Query String
e.g 新增字段`revision`：
```protobuf
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
```

说明：
* 匹配规则：`GET /v1/messages/{message_id}/{sub.subfield}`
* HTTP请求: `GET /v1/messages/123456/foo?revision=2`
* Gateway获得的参数: `{"message_id": "123456", "revision": 2, "sub": {"subfield": "foo"}}`

#### 2.1.3 Alias

可以通过在 options 中增加 additional_bindings 参数来绑定多个 HTTP REST APIs。    
e.g 可以通过在 options 中增加 additional_bindings 来进行多个URL定义访问同一个请求：
```protobuf
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
```

说明1：

* 匹配规则：`GET /v1/messages/{message_id}/{sub.subfield}`
* HTTP请求: `GET /v1/messages/123456`
* Gateway获得的参数: `{"message_id": "123456"}`

说明2：

* 匹配规则：`GET /v1/users/{user_id}/messages/{message_id}`
* HTTP请求: `GET /v1/users/5467/messages/123456`
* Gateway获得的参数: `{"user_id": 5467, "message_id": "123456"}`

### 2.2 POST 方法
#### 2.2.1 POST body
e.g 指定参数名来映射 POST body：
```protobuf
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
```

说明:

* 匹配规则：`POST /v1/messages/{message_id}` && `body: "content" 和 UpdateMessageRequest.content 是映射关系`
* HTTP请求: `POST /v1/messages/123456 { "text": "Hi!" }`
* Gateway获得的参数: `{"message_id": "123456", "content": {"text": "Hi!"}}`，注意这里POST的参数被放到`content`下了
* P.S：UpdateMessageRequest 中的`hidden_column`字段由于未进行映射，所以在服务端获得的参数中不存在

#### 3.2.2 POST body: "*"
e.g 使用*来映射 POST body：
```protobuf
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
```

说明：

* 匹配规则：`POST /v1/messages/{message_id}` && `body: "*" 即 UpdateMessageRequest 中的字段全部按字段名映射`
* HTTP请求: `POST /v1/messages/123456 { "content": {"text": "Hi!"}, "hidden_column": true }`
* Gateway获得的参数: `{"message_id": "123456", "content": {"text": "Hi!"}}`
* P.S：输入参数`hidden_column`由于在 UpdateMessageRequest 中不存在，所以在服务端获得的参数中也不存在

## 3. optional | required
protobuf v3版本后，废弃了 message 字段中使用 optional 和 required 关键字设定字段是否可选项，而是默认全部字段都是可选。如果在正常业务中，需要将字段设定为必选，可以在 proto 文件转译成 swagger.json 后，可以手动在字段设定中添加`required`字段，并且值为`true`

e.g：
```json
{
    ...,
    "definitions": {
        "UpdateMessageRequest": {
          "type": "object",
          "properties": {
            "message_id": {
              "type": "string",
              "format": "int64",
              "required": true  // add required property
            },
            "hidden_column": {
              "type": "boolean",
              "format": "boolean"
            },
          }
        }
    }
}
```