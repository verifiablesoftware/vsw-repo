#!/bin/sh

# TODO - file or url genesis 
# if separate docker container for agent not needed that many configs here

NAME=vsw-repo
echo "start ${NAME}" 
export DOCKERHOST=${APPLICATION_URL-$(docker run --rm --net=host eclipse/che-ip)}

## we will use aws could leger for now, 
##if you want use your local you can comment out below set LEDGER_URL code

if [ -z $1 ]; then
    export LEDGER_URL="http://3.236.118.172:9000"
elif [ $1 = "--LEDGER_URL" ]; then
    export LEDGER_URL=$2  ## you can provide your own ledger url
elif [ $1 = "local" ]; then
    export LEDGER_URL="http://${DOCKERHOST}:9000"
elif [ $1 = "remote" ]; then
    export LEDGER_URL="http://dev.greenlight.bcovrin.vonx.io" ## use default AWS cloud ledger
elif [ $1 = "file"]; then
    export GENESIS_FILE=$2
fi

myip="$(dig +short myip.opendns.com @resolver1.opendns.com)"
echo "My WAN/Public IP address: ${myip}"
export IP=${myip}


echo "your local docker host ip address is: ${DOCKERHOST}"
echo "ledger ip address is: ${LEDGER_URL}"
echo "ledger file: ${GENESIS_FILE}"

if [ !"$(docker ps -qq -f name=${NAME})" ]; then
    echo "container ${NAME} is running, delete it first"
    docker rm ${NAME} -f
fi

docker build -t ${NAME} .
docker-compose up &
