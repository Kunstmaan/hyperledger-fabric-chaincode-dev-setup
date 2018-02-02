#!/bin/bash
set -eu -o pipefail

CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/crypto-config/org1.example.be/users/admin.org1.example.be/msp
CORE_PEER_ID=peer.org1.example.be
CORE_PEER_LOCALMSPID=org1-example-be-MSP
CORE_PEER_ADDRESS=peer.org1.example.be:7051
CORE_PEER_TLS_KEY_FILE=/etc/hyperledger/crypto-config/org1.example.be/peers/peer.org1.example.be/tlsca/tlsca.peer.org1.example.be-key.pem
CORE_PEER_TLS_CERT_FILE=/etc/hyperledger/crypto-config/org1.example.be/peers/peer.org1.example.be/tlsca/tlsca.peer.org1.example.be-cert.pem
CORE_PEER_TLS_ROOTCERT_FILE=/etc/hyperledger/crypto-config/org1.example.be/peers/peer.org1.example.be/tlsca.combined.peer.org1.example.be-cert.pem

export CORE_PEER_MSPCONFIGPATH
export CORE_PEER_ID
export CORE_PEER_LOCALMSPID
export CORE_PEER_ADDRESS
export CORE_PEER_TLS_KEY_FILE
export CORE_PEER_TLS_CERT_FILE
export CORE_PEER_TLS_ROOTCERT_FILE

