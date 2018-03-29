#!/bin/bash

if [ -z $GOONI_DIR ]; then
    echo "You must set \$GOONI_DIR"
    exit 1
fi

REPO_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )/.."

OS=$(uname)
ARCH=$(uname -m)

DST_DIR="$REPO_ROOT/bin"

if [ $OS = "Darwin" ];then
    DST_DIR="$DST_DIR/mac_x64"
else
    echo "This platform is currently not supported"
    exit 1
fi

cd $GOONI_DIR && make build
mkdir -p $DST_DIR
cp $GOONI_DIR/dist/ooni $DST_DIR
cd $REPO_ROOT
