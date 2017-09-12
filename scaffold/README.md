# SASDN_SCAFFOLD_DEMO

---

## INSTALL
### 1. NODE
NodeJs is required. Version 8+ is recommended. Download [here](https://nodejs.org/en/download/).

```bash
node --version # v8.1.0
npm --version # 5.0.3
```

### 2. SASDN-PM

```bash
npm install -g sasdn-pm
```

### 3. PROTOBUF

#### Windows
See [Protobuf official doc](https://github.com/google/protobuf/blob/master/src/README.md#c-installation---windows).

#### MAC

```bash
brew install protobuf
protoc --version # libprotoc 3.3.0
```

### 4. TypeScript

```bash
npm install -g typescript
tsc --version # @2.3.4
```

### 5. gRPC node tool
Used to generate js code from proto files.

```bash
npm install -g grpc-tools # @1.3.7
grpc_tools_node_protoc --version # libprotoc 3.2.0
```

### 6. grpc-gateway
grpc-gateway is a 3rd framework. We need a sub tool `protoc-gen-swagger` from this framework, to generate swagger json from proto files.

## Golang
Gateway tool is built with golang. So install it first, download [here](https://golang.org/dl/).
Then setup GOPATH following [this](https://github.com/golang/go/wiki/GOPATH).

## protoc-gen-swagger
```bash
go get -u github.com/grpc-ecosystem/grpc-gateway/protoc-gen-swagger
```

### RUN
