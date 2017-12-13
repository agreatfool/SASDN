Command Line Tool
=================
SASDN has a command line tool to help developers work.

# Command: Proto
Generate:

* NodeJs source codes 
* Typescript d.ts definitions of previous js codes
* Swagger json

from proto files.

```
sasdn proto [options]

  Options:

    -h, --help             output usage information
    -V, --version          output the version number
    -p, --proto <dir>      directory of source proto files
    -o, --output <dir>     directory to output codes
    -i, --import <items>   third party proto import path: e.g path1,path2,path3
    -e, --exclude <items>  files or paths in -p shall be excluded: e.g file1,path1,path2,file2
    -j, --javascript       add -j to output javascript codes
    -t, --typescript       add -t to output typescript d.ts definitions
    -s, --swagger          add -s to output swagger json
    -a, --all              also parse & output all proto files in import path?
```

# Command: Rpcs
Generate rpc server service stubs from proto files.

```
sasdn rpcs [options]

  Options:

    -h, --help              output usage information
    -V, --version           output the version number
    -p, --proto <dir>       directory of proto files
    -o, --output <dir>      directory to output service codes
    -i, --import <items>    third party proto import path: e.g path1,path2,path3
    -e, --exclude <items>   files or paths in -p shall be excluded: e.g file1,path1,path2,file2
```

# Command: Gateway
Generate gateway koa api stubs from swagger spec files.

```
sasdn gateway [options]

  Options:

    -h, --help              output usage information
    -V, --version           output the version number
    -p, --proto <dir>       directory of proto files
    -s, --swagger <dir>     directory of swagger spec files
    -o, --output <dir>      directory to output service codes
    -i, --import <items>    third party proto import path: e.g path1,path2,path3
    -d, --deepSearchLevel <number>    add -d to parse swagger definition depth, default: 5
    -c, --client            add -c to output API Gateway client codes
```

# Command: Scaffold
Generate demo Micro Service from scaffold files.

```
sasdn scaffold
```


# Command: Client
Generate remote rpc api client stubs from proto files.

```
sasdn client [options]

  Options:

    -V, --version          output the version number
    -p, --proto <dir>      directory of proto files
    -i, --import <items>   third party proto import path: e.g path1,path2,path3
    -o, --output <dir>     directory to output service codes
    -e, --exclude <items>  files or paths in -p shall be excluded: e.g file1,path1,path2,file2
    -z, --zipkin           need add zipkin plugin
    -h, --help             output usage information
```

if you use `--zipkin` option, you need to know:

- SASDN use [sasdn-zipkin](https://www.npmjs.com/package/sasdn-zipkin) to create zipkin traceing chain. if you want to use zipkin, you should read it carefully.
- sasdn-zipkin need some config to connect to remote collector and receive callback of other services. SASDN use process.ENV to config this options, e.g:
  ```
  export ZIPKIN_URL = {your remote collector address}
  export USER = {name of your service}
  export USER_PORT = {port of your service}
  export ORDER = {service name you connect}
  export ORDER_ADDRESS = {service address you connect}
  export ORDER_PORT = {service port you connect}
  
  node ...
  ```

  ```
  /** {process.env.ZIPKIN_URL} is you remote collector address
   *  {process.env.USER} is your service name
   *  {process.env.USER_PORT} is your service port
   */
  GrpcImpl.init(process.env.ZIPKIN_URL, {
      serviceName: process.env.USER,
      port: process.env.USER_PORT
  });
  /** {process.env.ORDER} is service name you connect 
   *  {process.env.ORDER_ADDRESS} is service address you connect 
   *  {process.env.ORDER_PORT} is service port you connect 
   */
  GrpcImpl.setReceiverServiceInfo({
      serviceName: process.env.ORDER,
      host: process.env.ORDER_ADDRESS,
      port: process.env.ORDER_PORT
  });

  const proxyClient = new GrpcImpl().createClient(
      new UserServiceClient(`${options.host}:${options.port}`, grpc.credentials.createInsecure()), 
      ctx
  );

  ```