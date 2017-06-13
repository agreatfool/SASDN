#!/bin/bash

BASEDIR=$(dirname "$0")
cd ${BASEDIR}/../

git add .
git commit -m "Update."

npm version patch --verbose
npm publish --verbose
git push origin master --verbose