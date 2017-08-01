#!/bin/bash

BASEDIR=$(dirname "$0")
cd ${BASEDIR}/../

PROTO_DEST=./src/proto

mkdir -p ${PROTO_DEST}

grpc_tools_node_protoc \
--js_out=import_style=commonjs,binary:${PROTO_DEST} \
--grpc_out=${PROTO_DEST} \
--plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin` \
--proto_path=./proto_third_party \
-I ./proto \
proto/*.proto

protoc \
--plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
--proto_path=./proto_third_party \
--ts_out=:${PROTO_DEST} \
-I ./proto \
proto/*.proto