#!/bin/sh
# 1 - agent provision first

PROVISION=provision

export SEED=my_seed_100000000000000000007777 
export ENDPOINT=http://192.168.65.3:8060
export WALLET_NAME=Repo.Agent
export WALLET_KEY=Repo.Agent 

echo "start ${PROVISION}" 

if [ !"$(docker ps -qq -f name=${PROISION})" ]; then
    echo "container ${PROVISION} is running, delete it first"
    docker rm ${PROVISION} -f
fi

cd ./provision

docker build -f ./Dockerfile.image \
    -t ${PROVISION} .
docker run -it --name ${PROVISION}\
 -p 8061:8061\
 -p 8060:8060\ 
 -e SEED_VAL=${SEED} ${PROVISION}

cd ..
