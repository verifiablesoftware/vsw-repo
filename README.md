# Verifiable Software

This project consists of the code for running a verifiable software repo. For
details about the verifiable software ecosystem, see
[vsw](https://github.com/verifiablesoftware/vsw) which contains the `vsw`
command line tool.

For informal discussions, we use slack : vswhq.slack.com
Anyone is welcome to join the slack channel using this invitation link: https://join.slack.com/t/vswhq/shared_invite/zt-kxvaycqc-v5dSDLfpUVevtrZsHsOr9Q
Slack invitation link is timed. The above link is going to expired on Feb 12, 2021. We will try to watch and update the link timely. In case we missed it, or it isn't working for you, please file a github issue to alert us. Welcome to the vsw project.
=======
# Verifiable Software VSW Repo

This project consists of the code for running a verifiable software repo. For
details about the verifiable software ecosystem, 

see
[vsw](https://github.com/verifiablesoftware/vsw) which contains the `vsw`
command line tool.

## build docker image 
```
docker build -t vsw-repo .
```

## run container with docker
```
docker run -d --name vsw-repo -p 8060:8060 -p 8061:8061 -p 8062:8062  vsw-repo
```

## shell script

run from the shell script

```
chmod +x start.sh
./start.sh
```

### for use AWS cloud ledger run 
```
./start.sh remote
```

### for use local ledger run 
```
./start.sh local
```

### for connect to publish ledger run 
```
./start.sh --LEDGER_URL  ${LEDGER_URL}
```

## publish

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
	schema saving
	restart with same seed -> DID registered -> schema 
	aca-py provision usage should be studied 		
	
	
- register DID (the same seed the agent was started)
	sovrin ledger and other relevant ledgers have different way to do this but seems to be mandatory before the schema can be created
	
- create schema for publish 
	this reguires registered DID

- create invitation
