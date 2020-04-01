#!/usr/bin/env bash

export ONEHEALTH_HOME=~/oneHealth
export ONEHEALTH_CONFIG=$ONEHEALTH_HOME/blockchains/config
export SAWTOOTH_HOME=$ONEHEALTH_HOME/blockchains/1h-chain1
export ONEHEALTH_SCRIPTS_DIR=$ONEHEALTH_HOME/blockchains/scripts

if [ $# -gt 0 ] && [ $1 == "create" ]
then
	sawadm genesis $ONEHEALTH_CONFIG/config-genesis.batch_1h-chain1 $ONEHEALTH_CONFIG/config.batch_1h-chain1
fi


sawtooth-validator \
--bind component:tcp://127.0.0.1:14004 \
--bind network:tcp://127.0.0.1:18800 \
--bind consensus:tcp://127.0.0.1:15050 \
--endpoint tcp://127.0.0.1:18800 &
devmode-engine-rust -vv --connect tcp://localhost:15050 &
sawtooth-rest-api -v --bind 127.0.0.1:18008 --connect 127.0.0.1:14004 &
settings-tp -v --connect tcp://127.0.0.1:14004 &
$ONEHEALTH_SCRIPTS_DIR/startOneHealth-chain1.sh "tcp://127.0.0.1:14004" &


