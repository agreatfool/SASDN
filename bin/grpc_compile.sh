#!/bin/bash

BASEDIR=$(dirname "$0")
cd ${BASEDIR}/../

PROTO_DEST=./src
BUILD_DEST=./build

mkdir -p ${PROTO_DEST}

grpc_tools_node_protoc \
--js_out=import_style=commonjs,binary:${PROTO_DEST} \
--grpc_out=${PROTO_DEST} \
--plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin` \
proto/*.proto

cp -r ./src/proto_plugin/lib/template ./build/proto_plugin/lib

protoc \
--plugin=protoc-gen-ts=./bin/protoc-gen-ts.js \
--ts_out=service=true:${PROTO_DEST}/proto \
-I ./proto \
proto/*.proto

cp -r ${PROTO_DEST}/proto ${BUILD_DEST}