SASDN
=====

Name: **S**table, **A**vailable, **S**calable, **D**istributed, **N**odeJs

## Install
```bash
node --version # v8.0.0
npm --version # 5.0.0

brew install protobuf
protoc --version # libprotoc 3.3.0

npm install -g grpc-tools # @1.3.7
grpc_tools_node_protoc --version # libprotoc 3.2.0

npm install -g typescript
tsc --version # @2.3.4
```

## TODO

- [x] 创建grpc简单sample
- [ ] 制作工具脚本，为grpc-tools生成出来的js代码生成t.ds定义
- [ ] 学习grpc中proto的设定细节
- [ ] grpc => restful 研究
- [ ] proto => swagger json
- [ ] swagger json => pdf 工具完善
- [ ] 架构设计：拓扑结构，既能做，又能做
- [ ] 架构设计：业务对外服务
- [ ] 架构设计：RPC后端服务
- [ ] 测试框架选定
- [ ] 单元测试

## grpc-gateway
### protoc-gen-swagger install
```
go get -u github.com/grpc-ecosystem/grpc-gateway/protoc-gen-swagger

protoc \
--swagger_out=logtostderr=true:${PROTO_DEST} \
-I ./proto \
proto/book.proto
```