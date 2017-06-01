#!/bin/bash

BASEDIR=$(dirname "$0")
cd ${BASEDIR}/../

tsc -p tsconfig.json --watch