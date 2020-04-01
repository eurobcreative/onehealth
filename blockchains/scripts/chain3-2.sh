#!/usr/bin/env bash

export ONEHEALTH_HOME=~/oneHealth
export ONEHEALTH_CONFIG=$ONEHEALTH_HOME/blockchains/config
export SAWTOOTH_HOME=$ONEHEALTH_HOME/blockchains/1h-chain32
export ONEHEALTH_SCRIPTS_DIR=$ONEHEALTH_HOME/blockchains/scripts

if [ $# -gt 0 ] && [ $1 == "create" ]
then
	sawadm genesis $ONEHEALTH_CONFIG/config-genesis.batch_1h-chain3 $ONEHEALTH_CONFIG/config.batch_1h-chain3
fi

sawtooth-validator \
--bind component:tcp://127.0.0.1:34006 \
--bind network:tcp://127.0.0.1:38802 \
--bind consensus:tcp://127.0.0.1:35052 \
--endpoint tcp://127.0.0.1:38802 &
devmode-engine-rust -vv --connect tcp://localhost:35052 &
sawtooth-rest-api -v --bind 127.0.0.1:38010 --connect 127.0.0.1:34006 &
settings-tp -v --connect tcp://127.0.0.1:34006 &
$ONEHEALTH_SCRIPTS_DIR/startOneHealth-chain3.sh "tcp://127.0.0.1:34006" &


