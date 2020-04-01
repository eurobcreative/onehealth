#!/usr/bin/env bash

export ONEHEALTH_HOME=~/oneHealth
export ONEHEALTH_SCRIPTS_DIR=$ONEHEALTH_HOME/blockchains/scripts

$ONEHEALTH_SCRIPTS_DIR/chain1.sh
echo ""
echo "############################################################"
echo "Re-launching Blockchain1"
sleep 3


$ONEHEALTH_SCRIPTS_DIR/chain2-0.sh
echo ""
echo "############################################################"
echo "Re-launching Blockchain2-0"
sleep 3


$ONEHEALTH_SCRIPTS_DIR/chain2-1.sh
echo ""
echo "############################################################"
echo "Re-launching Blockchain2-1"
sleep 3


$ONEHEALTH_SCRIPTS_DIR/chain2-2.sh
echo ""
echo "############################################################"
echo "Re-launching Blockchain2-2"
sleep 3


$ONEHEALTH_SCRIPTS_DIR/chain3-0.sh
echo ""
echo "############################################################"
echo "Re-launching Blockchain3-0"
sleep 3


$ONEHEALTH_SCRIPTS_DIR/chain3-1.sh
echo ""
echo "############################################################"
echo "Re-launching Blockchain3-1"
sleep 3


$ONEHEALTH_SCRIPTS_DIR/chain3-2.sh
echo ""
echo "############################################################"
echo "Re-launching Blockchain3-2"
sleep 3
echo ""
echo "############################################################"
echo "All the Blockchains are started!"
echo "Please, run <./stopAll_oneHealth.sh> to stop all oneHealth processes AND KEEPING all the BlochChain Data"
echo "or <./deleteAll_oneHealth.sh> to stop the processes AND REMOVE all oneHealth BlockChain Data"
