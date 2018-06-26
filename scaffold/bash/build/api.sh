#!/usr/bin/env bash

BASEDIR=$(dirname "$0")
cd ${BASEDIR}/../../
ROOT=${PWD}

PROTO_ROOT=${ROOT}/proto
PROTO_3RD=${ROOT}/spm_protos
OUTPUT=${ROOT}/

sasdn api \
--proto=${PROTO_ROOT} \
--import=${PROTO_3RD} \
--output=${OUTPUT}
