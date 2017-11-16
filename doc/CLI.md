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