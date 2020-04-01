#!/usr/bin/env bash

export ONEHEALTH_HOME=~/oneHealth
export ONEHEALTH_CONFIG=$ONEHEALTH_HOME/blockchains/config
export SAWTOOTH_HOME=$ONEHEALTH_HOME/blockchains/1h-chain22
export ONEHEALTH_SCRIPTS_DIR=$ONEHEALTH_HOME/blockchains/scripts

if [ $# -gt 0 ] && [ $1 == "create" ]
then
	sawadm genesis $ONEHEALTH_CONFIG/config-genesis.batch_1h-chain2 $ONEHEALTH_CONFIG/config.batch_1h-chain2
fi	

sawtooth-validator \
--bind component:tcp://127.0.0.1:24006 \
--bind network:tcp://127.0.0.1:28802 \
--bind consensus:tcp://127.0.0.1:25052 \
--endpoint tcp://127.0.0.1:28802 &
devmode-engine-rust -vv --connect tcp://localhost:25052 &
sawtooth-rest-api -v --bind 127.0.0.1:28010 --connect 127.0.0.1:24006 &
settings-tp -v --connect tcp://127.0.0.1:24006 &
$ONEHEALTH_SCRIPTS_DIR/startOneHealth-chain2.sh "tcp://127.0.0.1:24006" &

