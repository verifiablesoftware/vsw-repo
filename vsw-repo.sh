#!/bin/sh
# 1 - agent provision first - if not done

if [ -z $1 ]; then
    ./repo-start.sh "file"

# 2 - start vsw-repo 
elif [ $1 = "--init" ]; then
    ./repo-provision.sh 
    ./repo-start.sh "file"
fi

