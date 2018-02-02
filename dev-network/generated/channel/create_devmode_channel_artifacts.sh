#!/bin/bash
# This file is auto-generated
set -eu -o pipefail

PREFIX="../devmode/channel"
rm -rf $PREFIX
mkdir -p $PREFIX

FABRIC_CFG_PATH=$(pwd)
export FABRIC_CFG_PATH
echo FABRIC_CFG_PATH=$FABRIC_CFG_PATH


echo "Generating defaultchannel configuration transaction 'defaultchannel.tx'"
configtxgen -profile defaultchannel -channelID defaultchannel -outputCreateChannelTx $PREFIX/defaultchannel.tx
if [ "$?" -ne 0 ]; then
  echo "Failed to generate defaultchannel configuration transaction..." >&2
  exit 1
fi
echo "Done"
echo "-----"

echo "Generating devmode Genesis Block..."
configtxgen -profile devmodeorderergenesis -channelID devmodeorderergenesis -outputBlock $PREFIX/orderer.genesis.block
if [ "$?" -ne 0 ]; then
  echo "Failed to generate devmode channel configuration transaction..." >&2
  exit 1
fi
echo "Done"
echo "-----"
