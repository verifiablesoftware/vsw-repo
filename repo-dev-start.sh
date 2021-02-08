#!/bin/sh

#original repo start

NAME=vsw-repo-dev
echo "start ${NAME}" 
export DOCKERHOST=${APPLICATION_URL-$(docker run --rm --net=host eclipse/che-ip)}

## we will use aws could leger for now, 
##if you want use your local you can comment out below set LEDGER_URL code

#if [ -z $1 ]; then
    export LEDGER_URL="http://3.235.31.203:9000"
elif [ $1 = "--LEDGER_URL" ]; then
    export LEDGER_URL=$2  ## you can provide your own ledger url
elif [ $1 = "local" ]; then
    export LEDGER_URL="http://${DOCKERHOST}:9000"
elif [ $1 = "remote" ]; then
    export LEDGER_URL="http://3.235.31.203:9000" ## use default AWS cloud ledger
fi

myip="$(dig +short myip.opendns.com @resolver1.opendns.com)"
echo "My WAN/Public IP address: ${myip}"
export IP=${myip}

echo "your local docker host ip address is: ${DOCKERHOST}"

if [ !"$(docker ps -qq -f name=${NAME})" ]; then
    echo "container ${NAME} is running, delete it first"
    docker rm ${NAME} -f
fi

docker build -t ${NAME} .
docker-compose up &