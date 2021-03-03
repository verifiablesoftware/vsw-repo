#!/bin/sh

# TODO - file or url genesis 
# if separate docker container for agent not needed that many configs here
# change genesis file path
 
export EXTERNAL_HOST="0.0.0.0"
export HTTP_PORT="8050" 
export ADMIN_PORT="8051"
export WEBHOOK_PORT="8052" 
export GENESIS_FILE="/home/jte/git/vsw-repo/app/resources/genesis.txt"
export WALLET_KEY="Repo.Local "
export WALLET_NAME="Repo.Local "

cd ./app

node ./app.js