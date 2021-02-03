#!/bin/sh

# TODO - file or url genesis 
# if separate docker container for agent not needed that many configs here

NAME=vsw-repo
echo "start ${NAME}" 
export DOCKERHOST=${APPLICATION_URL-$(docker run --rm --net=host eclipse/che-ip)}

## use this as genesis file (sovrin ledger)

export GENESIS_FILE="/home/indy/resources/genesis.txt" ## use the ledger genesis file

myip="$(dig +short myip.opendns.com @resolver1.opendns.com)"
echo "My WAN/Public IP address: ${myip}"
export IP=${myip}

echo "your local docker host ip address is: ${DOCKERHOST}"
echo "genesis file: ${GENESIS_FILE}"

if [ !"$(docker ps -qq -f name=${NAME})" ]; then
    echo "container ${NAME} is running, delete it first"
    docker rm ${NAME} -f
fi

docker build -t ${NAME} .
docker-compose up &
