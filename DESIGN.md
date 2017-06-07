DESIGN
======

## Ecosystem
1. 服务端的框架，生成的代码只有rpc调用
2. gateway框架，基于koa，生成的代码（对外）只有rest，另外生成的代码（对内）还有rpc，与第1点的框架通讯
3. 工具链：根据proto定义，创建服务端框架代码stub（rpc）
4. 工具链：根据proto定义，生成对应的swagger定义文件
5. 工具链：根据swagger定义文件，生成对应的PDF文档
4. 工具链：根据proto定义，创建gateway与服务端框架通讯的代码stub（rpc）
5. 工具链：根据swagger定义文件，创建gateway代码stub（rest）

## Design
### 服务端框架
* 完全兼容koa API和中间件，能够直接服用koa生态系统组件
* 启动服务器，响应rpc调用，所有处理都以Promise/Async来实现

### gateway框架
* 直接基于koa框架封装一层

## Resources
* [grpc-gateway](https://github.com/grpc-ecosystem/grpc-gateway)
* [gRPC Web](https://github.com/grpc/grpc/blob/master/doc/PROTOCOL-WEB.md)
* [mali](https://malijs.github.io)
* [koa](http://koajs.com/)
* [protobuf](https://developers.google.com/protocol-buffers/docs/proto3)
* [Swagger Tools](http://swagger.io/tools/)
* [grpc](https://github.com/grpc/grpc)
* [gRPC Concepts](http://www.grpc.io/docs/guides/concepts.html)
* [another grpc.d.ts](https://github.com/mixer/etcd3/blob/master/src/types/grpc.d.ts)