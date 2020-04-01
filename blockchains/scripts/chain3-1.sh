#!/usr/bin/env bash

export ONEHEALTH_HOME=~/oneHealth
export ONEHEALTH_CONFIG=$ONEHEALTH_HOME/blockchains/config
export SAWTOOTH_HOME=$ONEHEALTH_HOME/blockchains/1h-chain31
export ONEHEALTH_SCRIPTS_DIR=$ONEHEALTH_HOME/blockchains/scripts

if [ $# -gt 0 ] && [ $1 == "create" ]
then
	sawadm genesis $ONEHEALTH_CONFIG/config-genesis.batch_1h-chain3 $ONEHEALTH_CONFIG/config.batch_1h-chain3
fi 

sawtooth-validator \
--bind component:tcp://127.0.0.1:34005 \
--bind network:tcp://127.0.0.1:38801 \
--bind consensus:tcp://127.0.0.1:35051 \
--endpoint tcp://127.0.0.1:38801 &
devmode-engine-rust -vv --connect tcp://localhost:35051 &
sawtooth-rest-api -v --bind 127.0.0.1:38009 --connect 127.0.0.1:34005 &
settings-tp -v --connect tcp://127.0.0.1:34005 &
$ONEHEALTH_SCRIPTS_DIR/startOneHealth-chain3.sh "tcp://127.0.0.1:34005" &


