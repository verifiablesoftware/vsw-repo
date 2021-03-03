# Verifiable Software VSW Repo

This project consists of the code for running a verifiable software vsw repo. 
For details about the verifiable software ecosystem, see
[vsw](https://github.com/verifiablesoftware/vsw) which contains the `vsw`
command line tool.

## generic

in order to not to get confused with the ports

local ports: 8050-8052
docker ports: 8040-8042
aws ports: 8060-8062


## Run vsw repo locally

provision the aca-py agent and create wallet

```
./repo-provision-local.sh
```
when running this, user will be prompted
``` 
Created new wallet
Wallet type: indy
Wallet name: Repo.Local
Created new public DID: G5ZDvU1Y7hTKnQR6xnCtM5
Verkey: 9DfRgQevqRE2HAC9n4T7whfLBet8yTa6jUWzXZMWrBcp

----

Please select an option:
 1. Accept the transaction author agreement and store the acceptance in the wallet
 2. Acceptance of the transaction author agreement is on file in my organization
 X. Skip the transaction author agreement   
 ```
 and before accepting, register DID and Verkey to [sovrin buildernet](https://selfserve.sovrin.org/) 


After provisioning, start the aca-py agent 
```
./repo-start-local.sh
```


## Run inside the docker

build docker image(s) (requires wallet to start the vsw-repo) 

for vsw-repo
```
docker build -t vsw-repo .
```

## run vsw-repo container with docker
```
docker run -d --name vsw-repo -p 8060:8040 -p 8061:8041 -p 8062:8042  vsw-repo
```

## shell script

run docker from the shell script

```
chmod +x start.sh
./start.sh
```

# AWS

details about AWS can be found [AWS](/AWS_README.md)
when vsw-repo is running in the AWS cloud EC2 URL is something like this:

http://ec2-3-XXX-XXX-46.us-east-2.compute.amazonaws.com/8060

this has to be given to docker image when starting the vsw-repo docker image

## publish

a separate AWS_README.md is available for how this image can be build, pushed to private registry and 
run in AWS EC2.


minimum steps to get vsw-repo ready for publish

- start aca-py
	either url or genesis file is ok. 
		seed, no seed there might be a difference there?
	
	aca-py start can happen 
	1) from node.js as exec() 
	2) build separate container and start that
		tried also that but not straightforward
			tried three versions
			1) build from source 
				requres config.
			2) used ready made image 
				 verifiablesoftware/aries-cloudagent-python:latest
				 used in node.js
			3) used in dockerfile pip install aries-cloudagent
				issue with libindy.so -> does not run
			
		+ independent container easier to modify
		- requires set up of various start parameters again. done once for node.js version
		

	other:
	seed saving
	public DID saving
	schema saving - id
	restart with same seed -> DID registered -> schema 
	aca-py provision usage should be studied 		
	
	
- register DID (the same seed the agent was started)
	sovrin ledger and other relevant ledgers have different way to do this but seems to be mandatory before the schema can be created
	
- create schema for publish 
	this reguires registered DID

- create invitation



## Verifiable Software
For informal discussions, we use slack : vswhq.slack.com

Anyone is welcome to join the slack channel using this invitation link: 
https://join.slack.com/t/vswhq/shared_invite/zt-kxvaycqc-v5dSDLfpUVevtrZsHsOr9Q
Slack invitation link is timed. The above link is going to expired on Feb 12, 2021. We will try to watch and update the link timely. In case we missed it, or it isn't working for you, please file a github issue to alert us. Welcome to the vsw project.


