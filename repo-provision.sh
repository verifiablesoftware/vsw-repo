#!/bin/sh
# 1 - agent provision first

PROVISION=vsw-repo-provision

export SEED=my_seed_100000000000000000007777 
export ENDPOINT=http://ec2-3-138-121-46.us-east-2.compute.amazonaws.com:8060 
export WALLET_NAME=Repo.Agent
export WALLET_KEY=Repo.Agent 

echo "start ${PROVISION}" 
echo "SEED ${SEED}"
echo "ENDPOINT ${ENDPOINT}"

if [ !"$(docker ps -qq -f name=${PROVISION})" ]; then
    echo "container ${PROVISION} is running, delete it first"
    docker rm ${PROVISION} -f
fi

cd ./provision

docker build -f ./Dockerfile.image -t ${PROVISION} .

docker run -e "SEED_VAL=my_seed_100000000000000000007777" -e "ENDPOINT=http://ec2-3-138-121-46.us-east-2.compute.amazonaws.com:8060" -it ${PROVISION}

cd ..
