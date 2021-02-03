
NAME_PROV=repo-agent-provision
echo "start ${NAME_PROV}" 
export DOCKERHOST = ${APPLICATION_URL-$(docker run --rm --net=host eclipse/che-ip)}

myip="$(dig +short myip.opendns.com @resolver1.opendns.com)"
echo "My WAN/Public IP address: ${myip}"
export IP=${myip}
export HOST_PORT=8060

echo "your local docker host ip address is: ${DOCKERHOST}"

if [ !"$(docker ps -qq -f name=${NAME_PROV})" ]; then
    echo "container ${NAME_PROV} is running, delete it first"
    docker rm ${NAME_PROV} -f
fi

docker build -f ./provision/Dockerfile.image -t ${NAME_PROV} .
docker run -it --name ${NAME_PROV} -p 8061:8061 -p 8060:8060 ${NAME_PROV}
