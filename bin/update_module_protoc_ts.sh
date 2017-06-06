#!/bin/bash

BASEDIR=$(dirname "$0")
cd ${BASEDIR}/../

MODULE_NAME=grpc_tools_node_protoc_ts

npm uninstall ${MODULE_NAME}
npm install ${MODULE_NAME} --save-dev