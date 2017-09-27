#!/bin/bash

BASEDIR=$(dirname "$0")
cd ${BASEDIR}/../../

NODE_ENV=development DEBUG=SASDN:* node ./build/MsOrder.js