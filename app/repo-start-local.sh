#!/bin/sh

# TODO - file or url genesis 
# if separate docker container for agent not needed that many configs here
# change genesis file path
 
export EXTERNAL_HOST="127.0.0.1"
export HTTP_PORT="8060" 
export ADMIN_PORT="8061"
export WEBHOOK_PORT="8062" 
export ADMIN_API_KEY="0890dd23-bc39-40c6-9756-f9093a048c6c"
export GENESIS_FILE="/home/jte/git/vsw-repo/app/resources/genesis.txt"
export WALLET_KEY="Repo.Local "
export WALLET_NAME="Repo.Local "
export TAILS_URL="http://127.0.0.1:6543"


npm run start-dev