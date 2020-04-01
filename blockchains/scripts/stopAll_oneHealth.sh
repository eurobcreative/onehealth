#!/usr/bin/env bash

killall -9 devmode-engine-rust > /dev/null 2>&1
killall -9 sawtooth-validator > /dev/null 2>&1
killall -9 settings-tp > /dev/null 2>&1
killall -9 sawtooth-rest-api > /dev/null 2>&1
killall -9 node > /dev/null 2>&1

echo ""
echo "############################################################"
echo "All oneHealth related processes are stopped."
echo "Please, run <./relaunch_oneHealth.sh> to re-launch them"
echo "or <./deleteAll_oneHealth.sh> to remove all oneHealth BlockChain Data"
