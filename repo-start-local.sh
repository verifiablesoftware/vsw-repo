#!/bin/sh

# TODO - file or url genesis 
# if separate docker container for agent not needed that many configs here
# change genesis file path
 
export EXTERNAL_HOST="127.0.0.1"
export HTTP_PORT="8060" 
export ADMIN_PORT="8061"
export WEBHOOK_PORT="8062" 
export GENESIS_FILE="/home/jte/git/vsw-repo/app/resources/genesis.txt"
export WALLET_KEY="Repo.Local "
export WALLET_NAME="Repo.Local "

cd ./app

node ./app.js