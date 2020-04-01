#!/usr/bin/env bash

export ONEHEALTH_HOME=~/oneHealth

killall -9 devmode-engine-rust > /dev/null 2>&1
killall -9 sawtooth-validator > /dev/null 2>&1
killall -9 settings-tp > /dev/null 2>&1
killall -9 sawtooth-rest-api > /dev/null 2>&1
killall -9 node > /dev/null 2>&1

rm -rf $ONEHEALTH_HOME/blockchains/1h-chain?/data/*
rm -rf $ONEHEALTH_HOME/blockchains/1h-chain?/logs/*

rm -rf $ONEHEALTH_HOME/blockchains/1h-chain??/data/*
rm -rf $ONEHEALTH_HOME/blockchains/1h-chain??/logs/*

echo ""
echo "############################################################"
echo "All oneHealth related processes are stopped AND all their BlockChain Data removed."
echo "Please, run <./startAll_oneHealth.sh> to start them again"
