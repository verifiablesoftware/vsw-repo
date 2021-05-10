# VSW-REPO

### VSW-REPO API
description of the API available in a swagger

![#eb4947](https://via.placeholder.com/15/eb4947/000000?text=+) [VSW-REPO swagger](http://www.vswrepo.com:8062/apiDoc/)

### REPO LOG FILE
Download the repo server log file

![#eb4947](https://via.placeholder.com/15/eb4947/000000?text=+) [repo logs](http://www.vswrepo.com:8062/admin/repologs)

### ACA-PY LOG FILE
Download the aries agent log file

![#eb4947](https://via.placeholder.com/15/eb4947/000000?text=+) [aca-py logs](http://www.vswrepo.com:8062/admin/agentlogs)

### ACA-PY WALLET content
Download the aries aca-py wallet content

![#eb4947](https://via.placeholder.com/15/eb4947/000000?text=+) [aca-py wallet](http://localhost:8062/admin/wallet)


### Connections 
api for getting the current connections with clients


![#eb4947](https://via.placeholder.com/15/eb4947/000000?text=+) [server connections](http://www.vswrepo.com:8062/controller/connections/) 


### Packages
json list of packages

![#eb4947](https://via.placeholder.com/15/eb4947/000000?text=+) [SW packages](http://www.vswrepo.com:8062/controller/packages)


### VSW-REPO server Basics

VSW-REPO server is running in AWS in a docker container.

VSW-REPO server is implemented using a generated a simple express node server with express generator
see [express generator](https://expressjs.com/en/starter/generator.html) for details. Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.

VSW-REPO is connected to [vsw tails server](https://github.com/bcgov/indy-tails-server) 


## ACA-PY API

is available in 

![#eb4947](https://via.placeholder.com/15/eb4947/000000?text=+) [aca-py swagger](http://www.vswrepo.com:8061/api/doc)


### ACA-PY

vsw repo is using 

![#eb4947](https://via.placeholder.com/15/eb4947/000000?text=+) [Hyperledger Aries Cloud Agent - Python](https://github.com/hyperledger/aries-cloudagent-python)

Hyperledger Aries Cloud Agent Python (ACA-Py) is a foundation for building Verifiable Credential (VC) ecosystems. It operates in the second and third layers of the [Trust Over IP framework (PDF)](https://trustoverip.org/wp-content/uploads/sites/98/2020/05/toip_050520_primer.pdf) using [DIDComm messaging](https://github.com/hyperledger/aries-rfcs/tree/master/concepts/0005-didcomm) and [Hyperledger Aries](https://www.hyperledger.org/use/aries) protocols. The "cloud" in the name means that ACA-Py runs on servers (cloud, enterprise, IoT devices, and so forth), but is not designed to run on mobile devices.


