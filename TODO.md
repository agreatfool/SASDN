TODO
====
proto cli 工具应该添加 -e 来过滤某些指定的文件夹或指定的文件

因为在book.proto中有import google的api proto
现在生成出来的d.ts文件中也进行了对应的import，查看 protoc_xxx（创建d.ts项目）中的代码，看下到底是什么地方在输出这部分内容

学习swagger specification http://swagger.io/specification
学习swagger相关工具套件

整合swagger with koa ?
根据swagger json 生成代码 ? https://github.com/swagger-api/swagger-node
还是放弃整合 swagger with koa，直接使用 swagger node 来生成代码，然后在 koa 中使用
https://github.com/BigstickCarpet/swagger-parser
https://www.npmjs.com/package/koa-router-swagger ?
http://editor.swagger.io/
http://swagger.io/getting-started/
http://swagger.io/tools/
https://github.com/swagger-api/swagger-js

制作DESIGN.md中的相关框架及工具
制作架构图

grpc gateway
http://www.grpc.io/blog/coreos