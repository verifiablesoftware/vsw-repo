const express = require('express');
let router = express.Router();
const axios = require('axios').default;
const fs = require("fs");
const keys = require('../config/keys.js');

const DEFAULT_EXTERNAL_HOST = `${process.env.EXTERNAL_HOST}` || `${process.env.DOCKERHOST}`;
const ADMIN_PORT = `${process.env.ADMIN_PORT}` || 8061;
const ADMIN_URL = `http://${DEFAULT_EXTERNAL_HOST}:${ADMIN_PORT}`

// should not be needed
let REPO_DID = "";
let seed = keys.seed;
let schema_definition;



/** 
 * @swagger
 *  /controller/connections/:
 *    get:
 *      summary: Get all connections
 *      tags: [connections]
 *      requestBody:
 *        required: false
 *      responses:
 *        200:
 *          description: Success
*/
router.get("/connections", async (req, response) => {
  var data = " ";
  var config = {
    method: "get",
    url: `${ADMIN_URL}/connections`,
    headers: {},
    data: data,
  };
  axios(config)
    .then(function (res) {
      console.log("controller - connections");
      response.json(res.data.results);
    })
    .catch((error) => {
      console.error(error.response);
      response.status(500).send(error).end();
    });
})

/** 
 * @swagger
 *  /controller/remove_connection/{connection_id}:
 *    post:
 *      summary: Remove connection
 *      tags: [remove connection]
 *      parameters:
 *       - in: path
 *         name: connection_id
 *         required: true
 *         type: string
 *         minimum: 
 *         description: d3b696be-2290-451d-832a-XXXXXXXXXX
 *      requestBody:
 *        required: false
 *      responses:
 *        200:
 *          description: Success
*/
router.post("/remove_connection/:connection_id", async (req, response) => {
  var data = " ";
  var connection_id = req.params.connection_id;
  var config = {
    method: "post",
    url: `${ADMIN_URL}/connections/${connection_id}/remove`,
    headers: {},
    data: data,
  };
  axios(config)
    .then(function (res) {
      console.log(`controller - connection remove - ${connection_id}`);
      response.json(res.data.results);
    })
    .catch((error) => {
      console.log(`controller - connection remove - ${connection_id} fails`);
      console.error(error.response);
      response.status(500).send(error).end();
    });
})

/** 
 * @swagger
 *  /controller/records/:
 *    get:
 *      summary: get simplified list of records 
 *      tags: [records]
 *      requestBody:
 *        required: false
 *      responses:
 *        200:
 *          description: Success
*/
router.get("/records", async (req, response) => {
  let data = " ";
  let config = {
    method: "get",
    url: `${ADMIN_URL}/issue-credential/records`,
    headers: {},
    data: data,
  };
  axios(config)
    .then(function (res) {
      console.log("controller - credential records");
      let records = res.data.results;
      let simplified = [];
      let counter = 0;
      records.forEach(record => {
        console.log(`${counter++} : ${record.credential_exchange_id}`);
        let details = {};
        if (record.credential !== undefined) {
          details = {
            "credential_exchange_id": record.credential_exchange_id,
            "proposal": "NO",
            "sw": record.credential
          }
          simplified.push(details);
          //console.log(record.credential);
        }
        else if (record.credential_proposal_dict !== undefined) {
          details = {
            "credential_exchange_id": record.credential_exchange_id,
            "proposal": "YES",
            "sw": record.credential_proposal_dict.credential_proposal
          }
          simplified.push(details);
          //console.log(record.credential_proposal_dict.credential_proposal);
        }
      });
      response.json(simplified);
    })
    .catch((error) => {
      console.error(error.response);
      response.status(500).send(error).end();
    });
})


/** 
 * @swagger
 *  /controller/remove_record/{credential_exchange_id}:
 *    post:
 *      summary: Remove Credential Exchange Record by credential_exchange_id
 *      parameters:
 *       - in: path
 *         name: credential_exchange_id
 *         required: true
 *         type: string
 *         minimum: 
 *         description: d3b696be-2290-451d-832a-XXXXXXXXXX
 *      tags: [remove credential]
 *      requestBody:
 *        required: false
 *      responses:
 *        200:
 *          description: Success
*/
router.post("/remove_record/:credential_exchange_id", async (req, response) => {
  let data = " ";
  let cred_ex_id = req.params.credential_exchange_id
  console.log(`controller - remove_record - ${cred_ex_id}`);
  let config = {
    method: "post",
    url: `${ADMIN_URL}/issue-credential/records/${cred_ex_id}/remove`,
    headers: {},
    data: data,
  };
  axios(config)
    .then(function (res) {
      console.log("controller - removeRecord");
      response.json(res.data.results);
    })
    .catch((error) => {
      console.error(error.response);
      response.status(500).send(error).end();
    });
})

/** 
 * @swagger
 *  /controller/packages/:
 *    get:
 *      summary: Get all packages
 *      tags: [packages]
 *      requestBody:
 *        required: false
 *      responses:
 *        200:
 *          description: Success
*/
router.get("/packages", async (req, response) => {
  var data = " ";
  var config = {
    method: "get",
    url: `${ADMIN_URL}/credentials`,
    headers: {},
    data: data,
  };
  axios(config)
    .then(function (res) {
      console.log("controller - credentials");
      var attrs = res.data.results;
      response.json(res.data.results);
    })
    .catch((error) => {
      console.error(error.response);
      response.status(500).send(error).end();
    });
})

/** 
 * @swagger
 *  /controller/did/:
 *    get:
 *      summary: Get DIDs
 *      tags: [DID]
 *      requestBody:
 *        required: false
 *      responses:
 *        200:
 *          description: Success
*/
router.get("/did", async (req, response) => {
  var data = " ";
  var config = {
    method: "get",
    url: `${ADMIN_URL}/wallet/did`,
    headers: {},
    data: data,
  };
  axios(config)
    .then(function (res) {
      console.log("controllerRoutes - get_public_did - respose received");
      //console.log(JSON.stringify(res.data.results))
      response.json(res.data.results);
    })
    .catch((error) => {
      console.error(error.response);
      response.status(500).send(error).end();
    });
})

// not needed
router.get("/schemas/:id", async (req, response) => {
  var data = " ";
  var schema_id = req.params.id;
  var config = {
    method: "get",
    url: `${ADMIN_URL}/schemas/${schema_id}`,
    headers: {},
    data: data,
  };
  axios(config)
    .then(function (res) {
      console.log("controller - schema by ID");
      //console.log(JSON.stringify(res.data.results))
      response.json(res.data.results);
    })
    .catch((error) => {
      console.error(error.response);
      response.status(500).send(error).end();
    });
  response.status(200);
})
// not needed 
router.get("/create_public_did", async (req, response) => {
  var data = " ";
  var config = {
    method: "get",
    url: `${ADMIN_URL}/wallet/did`,
    headers: {},
    data: data,
  };
  axios(config)
    .then(async (res) => {
      console.log("controllerRoutes - get_public_did - respose received");
      console.log(JSON.stringify(res.data.results));
      if (JSON.stringify(res.data.results) == "[]") {
        let l_data = {
          alias: "Repo.Agent",
          seed: seed,
          role: "TRUST_ANCHOR",
        };
        let l_res = await axios.post(`${LEDGER_URL}/register`, l_data);
        response.json(l_res.data);
      }
      response.json(res.data.results);
    })
    .catch((error) => {
      console.error(error.response);
      response.status(500).send(error).end();
    });
})
//  not needed
router.get("/invitation", async (req, response) => {
  var config = {
    method: "get",
    url: `${ADMIN_URL}/wallet/did`,
    headers: {},
    data: "",
  };
  // get DID
  axios(config)
    .then((res) => {
      console.log("DID respose received");
      //console.log(res)
      var results = res.data.results[0];
      REPO_DID = results.did;

      if (REPO_DID == "") {
        console.log("controller - get invitation - NO DID");
      } else {
        console.log(`rep DID: ${REPO_DID}`);
      }
      // invitation

      var inv_config = {
        method: "post",
        url: `${ADMIN_URL}/connections/create-invitation?multi_use=true`,
        headers: { "Content-Type": "application/json" },
        data: "",
      };
      axios(inv_config)
        .then((res) => {
          //changing annoying localhost in the invitation to the dockerhost
          var invitation = res.data.invitation;
          console.log(invitation);
          console.log(REPO_DID);
          var invitation_config = { repo: REPO_DID.toString(), invitation };
          //console.log(config)
          response.json(invitation_config);
        })
        .catch((error) => {
          console.error(error.response);
          response.status(500).send(error).end();
        });
    })
    .catch((error) => {
      console.error(error.response);
      response.status(500).send(error).end();
    });
})
// not needed currently
router.get("/create_invitation", async (req, response) => {
  var data = " ";
  var config = {
    method: "post",
    url: `${ADMIN_URL}/connections/create-invitation?multi_use=true`,
    headers: {},
    data: data,
  };
  axios(config)
    .then(function (res) {
      console.log("create_invitation - respose received");
      //console.log(res)
      //var invitation = res.data.invitation;
      //console.log(`invitation ${invitation.serviceEndpoint}`)
      var inv = JSON.parse(res.data.invitation);
      console.log(`invitation ${inv}`);
      //inv.serviceEndpoint = "http://192.168.65.3:8060"
      invitation = JSON.stringify(inv);
      var config = { repo: REPO_DID, invitation };
      //console.log(config)
      response.json(config);
    })
    .catch((error) => {
      console.error(error.response);
      response.status(500).send(error).end();
    });
})

// not needed - schema is already created
router.get("/create_schema", async (req, response) => {
  schema_definition = load_schema_definition();
  let schema_body = schema_definition.schema_body;
  console.log(schema_body);
  axios
    .post(
      `http://${DEFAULT_INTERNAL_HOST}:${ADMIN_PORT}/schemas`,
      schema_body
    )
    .then((res) => {
      var schema_id = res.data.schema_id;
      console.log("schema created id is {" + schema_id + "}");
      // TODO save?
      let credential_definition_body = {
        schema_id: schema_id,
        support_revocation: schema_definition.support_revocation,
        revocation_registry_size: schema_definition.revocation_registry_size,
      };
      axios
        .post(
          `http://${DEFAULT_INTERNAL_HOST}:${ADMIN_PORT}/credential-definitions`,
          credential_definition_body
        )
        .then((result) => {
          var credential_definition_id = result.data.credential_definition_id;
          console.log("Cred def ID:" + credential_definition_id);
          response.status(200).end();
        })
        .catch((error) => console.log(error));
    })
    .catch((error) => {
      console.error(error);
    });
});



function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function load_schema_definition() {
  let rawdata = fs.readFileSync("resources/schema.definition.json");
  schema_definition = JSON.parse(rawdata);
  console.log(schema_definition);
  return schema_definition;
}

module.exports = router;
