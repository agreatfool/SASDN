#!/bin/bash

BASEDIR=$(dirname "$0")
cd ${BASEDIR}/../../
ROOT=${PWD}

PROTO_ROOT=${ROOT}/proto
PROTO_3RD=${ROOT}/spm_protos
OUTPUT=${ROOT}/src

echo "***********************"
echo "Working dir: ${ROOT}"
echo "Proto dir: ${PROTO_ROOT}"
echo "Proto 3rd dir: ${PROTO_3RD}"
echo "Output dir: ${OUTPUT}"

echo "***********************"
echo "Delete dir: ${OUTPUT}/proto"
rm -rf ${OUTPUT}/proto

echo "***********************"
echo "Generate js codes ..."
sasdn proto \
--proto=${PROTO_ROOT} \
--output=${OUTPUT} \
--import=${PROTO_3RD} \
--javascript \
--all

echo "Generate d.ts codes ..."
sasdn proto \
--proto=${PROTO_ROOT} \
--output=${OUTPUT} \
--import=${PROTO_3RD} \
--typescript \
--exclude=${PROTO_3RD}/google \
--all

echo "Generate swagger json ..."
sasdn proto \
--proto=${PROTO_ROOT} \
--output=${OUTPUT} \
--import=${PROTO_3RD} \
--swagger \
--exclude=${PROTO_3RD}/google,${PROTO_3RD}/order \
--all

echo "Delete old web router code ..."
rm -rf ${OUTPUT}/router

echo "Generate web router codes ..."
sasdn gateway \
--proto=${PROTO_ROOT} \
--swagger=${OUTPUT}/proto \
--output=${OUTPUT} \
--import=${PROTO_3RD}
