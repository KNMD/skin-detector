DIR="$( cd -P "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BUILD_CONTEXT="${DIR}/.."
echo ${DIR}
echo ${BUILD_CONTEXT}

source ${DIR}/build.env

cmd="docker save -o ./${CONTAINER}_${TAG}.tar ${IMAGE_NAME}"
echo ${cmd}
eval ${cmd}

cmd="scp ${CONTAINER}_${TAG}.tar root@beauty-app:/root/code/beauty-app"

echo ${cmd}
eval ${cmd}

