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

cp -r ${PROTO_DEST}/proto ${BUILD_DEST}