## Getting Started

---

### Requirements
Mac OS X, Windows, or Linux，
Protocol Buffers version 3.3+

* NPM Global
    * node `^8.1.0`
    * npm `^5.0.3`
    * typescript `^2.3.4`
    * grpc-tools `^1.3.7`
    * gulp `^3.9.1`
    * better-npm-run `^0.1.0`
* Golang Plugin
    * github.com/grpc-ecosystem/grpc-gateway/protoc-gen-swagger

### Directory Layout

Before you start, take a moment to see how the project structure looks like:

```
.
├── /__tests__/                 # Unit and end-to-end tests
├── /bash/                      # The folder for bash shell
├── /build/                     # The folder for compiled output
├── /node_modules/              # 3rd-party libraries and utilities
├── /proto/                     # The folder for .proto file in current project
├── /spm_protos/                # 3rd-party sasdn proco package form SASDN-PM
├── /src/                       # The source code of the application
│   ├── /handler/               # Handler singleton need start before Server-side startup
│   ├── /lib/                   # The folder for service implementation code
│   ├── /proto/                 # The interface definition file(ts, js, swagger.json) generated through the proto file
│   ├── /router/                # The API router generated through the swagger file
│   ├── /services/              # The service file generated through the proto file
│   ├── /demoGatewayServer.ts   # Gateway Client demo
│   ├── /demoMicorClient.ts     # Micorservice Server demo
│   ├── /demoMicorServer.ts     # Gateway Server demo
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