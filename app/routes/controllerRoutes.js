import express from "express";
import { Router } from "express";
import axios from "axios";
import fs from "fs";

const DEFAULT_INTERNAL_HOST =
  `${process.env.DOCKERHOST}` || hostname.docker.internal;
const DEFAULT_EXTERNAL_HOST = DEFAULT_INTERNAL_HOST;
const HTTP_PORT = 8060;
const ADMIN_PORT = 8061;
const WEBHOOK_PORT = 8062;
const ADMIN_URL = `http://${DEFAULT_INTERNAL_HOST}:${ADMIN_PORT}`;
//  controller routes
let REPO_DID = "";
let seed = "my_seed_00000000000000000000" + getRandomInt(9999);
let schema_definition;

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function load_schema_definition() {
  let rawdata = fs.readFileSync("resources/schema.definition.json");
  schema_definition = JSON.parse(rawdata);
  console.log(schema_definition);
  return schema_definition;
}

let controllerRoutes = Router()
  .get("/invitation", async (req, response) => {
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
  .get("/connections", async (req, response) => {
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
        //console.log(JSON.stringify(res.data.results))
        response.json(res.data.results);
      })
      .catch((error) => {
        console.error(error.response);
        response.status(500).send(error).end();
      });
  })
   // sw packages from db?
  .get("/schemas/:id", async (req, response) => {
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
  // sw packages from db?
  .get("/packages", async (req, response) => {
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
  // 
  .get("/package/:name", async (req, response) => {
    response.status(200);
  })

  .get("/did", async (req, response) => {
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
 
  .get("/create_public_did", async (req, response) => {
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

  .get("/create_invitation", async (req, response) => {
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
  

  .get("/create_schema", async (req, response) => {
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

export default controllerRoutes;
