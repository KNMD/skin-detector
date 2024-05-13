#!/bin/bash

DIR="$( cd -P "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BUILD_CONTEXT="${DIR}/.."
echo ${DIR}
echo ${BUILD_CONTEXT}

source ${DIR}/build.env

eval ${cmd}
echo ${cmd}
# cmd="rm -rf ${BUILD_CONTEXT}/.next"
echo ${cmd}
eval ${cmd}

# cmd="npm run build"
echo ${cmd}
eval ${cmd}

cmd="docker build -f Dockerfile -t ${IMAGE_NAME} ${BUILD_CONTEXT}"
echo ${cmd}
eval ${cmd}

cmd="docker push ${IMAGE_NAME}"
eval ${cmd}

echo ${IMAGE_NAME}

rm -rf .env

echo "DOCKER_IMAGE_TAG=${IMAGE_NAME}" > .env
