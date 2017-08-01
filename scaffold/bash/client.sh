#!/bin/bash

BASEDIR=$(dirname "$0")
cd ${BASEDIR}/../

DEBUG=SASDN:* node ./build/client.js