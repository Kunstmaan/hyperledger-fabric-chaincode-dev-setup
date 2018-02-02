#!/bin/bash
# This file is auto-generated

# This file allows you to create and join a channel. It requires
# channel_tools.sh to be sourced for all commands to work

set -eu -o pipefail

if [ $# -ne 1 ];
then
	echo ""
	echo "Usage: "
	echo "	create_and_join_channel CHANNEL_ID"
	exit 1
fi

. /etc/hyperledger/configtx/channel_tools.sh

channel_id=$1


if [ $channel_id == "defaultchannel" ]; then
  channel_orderer=orderer
  channel_orderer_org=org1.example.be

  wait_for_host peer.org1.example.be

  create_channel peer org1.example.be $channel_orderer $channel_orderer_org $channel_id
  join_channel peer org1.example.be $channel_orderer $channel_orderer_org $channel_id
else
  puts "Unknown channel id $channel_id"
fi