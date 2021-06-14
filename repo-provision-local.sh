#!/bin/bash
# 
# endpoint, seed, wallet name, wallet key and genesis file should be variables
# 
ENDPOINT="http://127.0.0.1:8060"
GENESIS_FILE="/home/jte/git/vsw-repo/app/resources/genesis.txt" 
WALLET_KEY="Repo.Local"
WALLET_NAME="Repo.Local"
SEED="my_seed_000000000000000000008876"

aca-py provision \
--endpoint $ENDPOINT \
--genesis-file $GENESIS_FILE \
--wallet-type indy \
--wallet-name $WALLET_NAME \
--wallet-key $WALLET_KEY \
--seed $SEED