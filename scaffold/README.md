## SASDN Scaffold README

### 1. 环境及安装
环境及安装相关内容请参考SASDN的[主文档](https://github.com/agreatfool/SASDN/blob/master/README.md)。

### 2. 文件夹结构

```
.
├── /__tests__/                 # 单元测试脚本
├── /bash/                      # 命令行脚本文件夹，内容及层级可以自定义
│   ├── /build/proto.sh         # proto文件解析及代码生成脚本
│   └── /sample/                # 脚手架项目中附带的范例代码启动脚本
├── /build/                     # 从TS代码编译出来的JS代码文件
├── /node_modules/              # NPM包安装路径
├── /proto/                     # 当前项目自身的protobuf定义文件，proto文件路径需要和文件内容中的包层级一致
├── /spm_protos/                # 第三方的proto定义文件，由SASDN-PM统一管理
├── /src/                       # 项目源代码
│   ├── /helper/                # Helper工具类，该文件夹内的工具类及层级可以自定义
│   ├── /logic/                 # 实际业务逻辑文件夹，该文件夹内的层级可以自定义
│   ├── /proto/                 # 自动生成代码：工具根据proto文件定义自动生成的模型及服务代码
│   ├── /router/                # 自动生成代码：工具根据swagger.json配置自动生成，供基于koa的Gateway使用
│   ├── /sample/                # 脚手架项目附带的范例代码，微服务服务器和Gateway服务器
│   ├── /services/              # 自动生成代码：工具根据proto文件定义自动生成的服务代码，供微服务服务器使用
│   ├── /GWDemo.ts              # Gateway范例入口
│   └── /MSOrder.ts             # Microservice范例入口
├── config.dev.json             # 开发用配置文件，当环境变量设置：env = developement
├── config.json                 # 生产环境配置文件，当环境变量设置：env = production
├── gulpfile.js                 # gulp命令脚本
├── package.json                # NPM配置文件
├── README.md                   # README file
├── spm.json                    # SASDN-PM配置文件
└── tsconfig.json               # TS的编译配置
```

### 3. 编程指引

#### 3.1 SASDN
了解功能，并掌握[SASDN](https://github.com/agreatfool/SASDN/blob/master/README.md)使用方法。

#### 3.2 SPM
了解功能，并掌握[SPM](https://github.com/agreatfool/SPM/blob/master/README.md)使用方法。

#### 3.3 SASDN CLI
SASDN包含了一个非常强大的命令行工具。请使用global方式安装SASDN，然后就可以使用这些命令了。    
文档请查看：[链接](https://github.com/agreatfool/SASDN/blob/master/doc/CLI.md)。

命令帮助信息请使用：    
```bash
sasdn -h # 查看完整子命令列表
sasdn help ${SUBCMD} # 查看子命令参数列表
```

常见使用方式请参考范例项目的[bash脚本](https://github.com/agreatfool/SASDN/blob/master/scaffold/bash/build/proto.sh)。

#### 3.3 SPM CLI
SASDN系统的包管理使用了SPM这个库，它也是一个命令行工具。请使用global方式安装SASDN-PM，然后就可以使用这些命令了。

命令帮助信息请使用：
```bash
sasdn-pm -h # 查看完整子命令列表
sasdn-pm help ${SUBCMD} # 查看子命令参数列表
```

常用命令：
```bash
sasdn-pm publish # 将当前项目的proto发布到中心服务器上
sasdn-pm search # 查询需要的proto包
sasdn-pm install # 安装指定的proto包
```

#### 3.4 范例说明
启动脚本：
```
.
└── /bash/
    └── /sample/
        ├── client.sh # 使用curl命令发送一个HTTP请求到Gateway服务器
        ├── gateway.sh # 启动Gateway服务器，接收来自client的HTTP请求，并与Microservice服务器通讯处理业务
        └── microservice.sh # 启动Microservice服务器，接收来自Gateway的业务请求
```

Gateway业务流：
```
/bash/sample/gateway.sh
    /src/GWDemo.ts
        /src/sample/GWDemo.ts
            /src/router/Router.ts
                /src/logic/gateway/OrderLogic.ts
                    /src/sample/client/MSClientOrder.ts
                        => Microservice Server
```

Microservice业务流：
```
/bash/sample/microservice.sh
    /src/MSOrder.ts
        /src/sample/MSOrder.ts
            /src/services/Register.ts
                /srcservices/order/order_grpc_pb/OrderService/getOrder.ts
```

#### 3.5 常规编程指引
步骤：

1. 编辑项目的*.proto文件
2. 使用sasdn工具生成stub代码（注意代码覆盖问题）
3. 在router(Gateway) / service(Microservice)中放置逻辑入口
4. 在逻辑代码文件中添加真正的业务逻辑
5. 编写单元测试脚本
6. 将完成且经过测试的代码提交
7. 使用sasdn-pm命令将proto包发布到中心服务器上