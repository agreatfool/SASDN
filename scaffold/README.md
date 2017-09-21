## SASDN Scaffold README

### 1. 环境及安装
环境及安装相关内容请参考SASDN的主文档。

### 2. 文件夹结构

```
.
├── /__tests__/                 # 单元测试用例
├── /bash/                      # 命令行脚本文件夹，内容及层级可以自定义
├── /build/                     # 从TS代码编译出来的JS代码文件
├── /node_modules/              # NPM三方包
├── /proto/                     # 当前项目自身的protobuf定义文件，注意文件夹层级需要和proto文件中的包路径一致
├── /spm_protos/                # 第三方的proto定义文件，由SASDN-PM统一管理
├── /src/                       # 项目源代码
│   ├── /helper/                # Helper工具类，该文件夹内的工具类及层级可以自定义
│   ├── /logic/                 # 实际业务逻辑文件夹，该文件夹内的层级可以自定义
│   ├── /proto/                 # Protos对应的代码：依据根目录的protos文件，用工具自动生成
│   ├── /router/                # Gateway Routers：依据swagger.json配置自动生成
│   ├── /services/              # The service file generated through the proto file
│   ├── /demoGatewayServer.ts   # Gateway Server demo
│   ├── /demoMSClient.ts        # Microservice Client demo
│   ├── /demoMSServer.ts        # Microservice Server demo
│   ├── /index.js               # Server-side startup script
│   └── ...                     # Other core framework modules
├── config.dev.json             # Global application settings when env = developement
├── config.json                 # Global application settings when env = production
├── index.js                    # Server-side startup script
├── README.md                   # README file
├── package.json                # The list of 3rd party libraries and utilities
├── spm.json                    # The list of 3rd party sasdn packages
└── tsconfig.json               # typescript config
```

### Quick Start

1. Run npm install

 > This will install both run-time project dependencies and developer tools listed in package.json file.

```
npm install
```

2. Run npm start

> This command will build the app from the source files (/src) into the output /build folder. As soon as the initial build completes, it will start the Node.js server (node build/index.js)

```
npm start
```

### How to Test

> To launch unit tests:

```
npm test
```

### How to use SASDN-PM CLI

[SPM README](https://github.com/agreatfool/SPM/blob/master/README.md)

> example：install order proto into ./spm_protos folder

```
sasdn-pm install order
sasdn-pm install order@1.0.0
```

### How to use SASDN CLI

[SPM README](https://github.com/agreatfool/SASDN/blob/design/doc/CLI.md)

> example：generate `./src/proto/order_pb` (js|ts|json) through the order.proto

```
sasdn proto -p ./proto -i ./spm_protos -o ./src/ -j -t -s -a
```

> example：generate `./src/services/order_grpc_pb` through the order.proto

```
sasdn rpcs -p ./proto -i ./spm_protos -o ./src/
```

> example：generate `./src/router/OrderApiService` through the `./src/proto/*/*.swagger.json`

```
sasdn gateway -p ./proto -i ./spm_protos -o ./src/ -s ./src/proto
```

### How to write business logic code

* You can write business logic code in `./src/lib/*.ts`, and call it in the controller method(`./src/router/*/*.ts` or `./src/services/*/*.ts`)