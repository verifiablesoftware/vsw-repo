# VSW-REPO

## VSW-REPO API
description of the API available in a swagger

![#eb4947](https://via.placeholder.com/15/eb4947/000000?text=+)  /apiDoc/ [api](http://www.vswrepo.com:8062/apiDoc/) 

___

### REPO LOG FILE
Download the VSW-Repo express server log file

![#eb4947](https://via.placeholder.com/15/eb4947/000000?text=+) /admin/repologs [repologs](http://www.vswrepo.com:8062/admin/repologs)

### ACA-PY LOG FILE
Download the aries agent log file

![#eb4947](https://via.placeholder.com/15/eb4947/000000?text=+) /admin/agentlogs [aca-py logs](http://www.vswrepo.com:8062/admin/agentlogs)

### ACA-PY WALLET content
Download the aries aca-py wallet content (not plain text)

![#eb4947](https://via.placeholder.com/15/eb4947/000000?text=+) /admin/wallet [aca-py wallet](http://www.vswrepo.com:8062/admin/wallet)


### Connections 
api for getting the current connections with clients


![#eb4947](https://via.placeholder.com/15/eb4947/000000?text=+) /controller/connections/ [server connections](http://www.vswrepo.com:8062/controller/connections/) 


### Packages
json list of packages

![#eb4947](https://via.placeholder.com/15/eb4947/000000?text=+) [SW packages](http://www.vswrepo.com:8062/controller/packages)

____
____
## VSW-REPO server 



VSW-REPO server is implemented using a generated a simple [Node.js](https://nodejs.org/en/) [Express](https://expressjs.com/) node server with express generator, 
see [express generator](https://expressjs.com/en/starter/generator.html) for details. Express is ae Node.js web application framework. In cloud environment VSW-REPO server is running in a Docker container and can be manually or automatically (by github) deployed to AWS.

VSW-REPO is also connected to [vsw tails server](https://github.com/bcgov/indy-tails-server) 

More details of the VSW-REPO server implementation can be read from [README](https://github.com/verifiablesoftware/vsw-repo/tree/master/app/readme/README.md) and how to deploy (if needed to AWS) from [AWS_README](https://github.com/verifiablesoftware/vsw-repo/tree/master/app/readme/AWS_README.md).


___
___
## Hyperledger Aries Cloud Agent  ACA-PY

vsw repo is using Hyperledger Aries, reusable, interoperable tool kit designed for initiatives and solutions focused on creating, transmitting and storing verifiable digital credentials. The source code is available for the link below:

![#eb4947](https://via.placeholder.com/15/eb4947/000000?text=+) [Hyperledger Aries Cloud Agent - Python](https://github.com/hyperledger/aries-cloudagent-python)

Hyperledger Aries Cloud Agent Python (ACA-Py) is a foundation for building Verifiable Credential (VC) ecosystems. It operates in the second and third layers of the [Trust Over IP framework (PDF)](https://trustoverip.org/wp-content/uploads/sites/98/2020/05/toip_050520_primer.pdf) using [DIDComm messaging](https://github.com/hyperledger/aries-rfcs/tree/master/concepts/0005-didcomm) and [Hyperledger Aries](https://www.hyperledger.org/use/aries) protocols. The "cloud" in the name means that ACA-Py runs on servers (cloud, enterprise, IoT devices, and so forth), but is not designed to run on mobile devices.

## ACA-PY API

is available in 

![#eb4947](https://via.placeholder.com/15/eb4947/000000?text=+) [aca-py swagger](http://www.vswrepo.com:8061/api/doc)




