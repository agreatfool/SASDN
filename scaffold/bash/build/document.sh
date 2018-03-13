#!/bin/bash

BASEDIR=$(dirname "$0")
cd ${BASEDIR}/../../
ROOT=${PWD}

PROTO_ROOT=${ROOT}/proto
PROTO_3RD=${ROOT}/spm_protos
OUTPUT=${ROOT}

echo "***********************"
echo "Working dir: ${ROOT}"
echo "Proto dir: ${PROTO_ROOT}"
echo "Proto 3rd dir: ${PROTO_3RD}"
echo "Output dir: ${OUTPUT}"

echo "***********************"
echo "Generate Document ..."
sasdn document \
--proto=${PROTO_ROOT} \
--output=${OUTPUT} \
--import=${PROTO_3RD} \
--service
