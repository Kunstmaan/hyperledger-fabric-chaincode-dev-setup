#!/bin/bash
# This file is auto-generated

set -eu -o pipefail

FABRIC_CFG_PATH="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
export FABRIC_CFG_PATH
echo FABRIC_CFG_PATH=$FABRIC_CFG_PATH
rm -rf *.tx
rm -rf *.block

PREFIX="."


echo "Generating defaultchannel configuration transaction 'defaultchannel.tx'"
configtxgen -profile defaultchannel -channelID defaultchannel -outputCreateChannelTx $PREFIX/defaultchannel.tx
if [ "$?" -ne 0 ]; then
  echo "Failed to generate defaultchannel configuration transaction..." >&2
  exit 1
fi
echo "Done"
echo "-----"

echo "Generating orderer.org1.example.be Genesis Block..."
configtxgen -profile ordererorg1examplebegenesis -channelID ordererorg1examplebegenesis -outputBlock $PREFIX/orderer.org1.example.be.genesis.block
if [ "$?" -ne 0 ]; then
  echo "Failed to generate orderer.org1.example.be channel configuration transaction..." >&2
  exit 1
fi
echo "Done"
echo "-----"
