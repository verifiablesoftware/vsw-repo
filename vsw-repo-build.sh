#!/bin/sh

# build docker image for AWS ECR

AWS_ECR = $1

echo "AWS ECR: " $1

docker build -t "vsw-repo-dev" .

docker tag vsw-repo-dev:latest "$1vsw-repo-dev:latest"
