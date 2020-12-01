import agent from './agent.js'
import express from 'express'
import axios from 'axios'
import bodyParser from "body-parser"
import JSON from "json"

const app = express()
const port = process.env.PORT || 8062

const LEDGER_URL = process.env.LEDGER_URL || `http://${process.env.DOCKERHOST}:9000`;
const REPO_AGENT = process.env.REPO_AGENT || "http://localhost:8060";
const ADMIN_URL = process.env.REPO_ADMIN || "http://localhost:8061";

let REPO_DID = ""; 
let credential_exchange_id = "";
let schema_id = 0;
let schema_definition;

// Tell express to use body-parser's JSON parsing
app.use(bodyParser.json());

//------------------------------------------------------
// Controller endpoints
//------------------------------------------------------
app.get("/health", async  (req, response) => {
  var data = " ";
  var config = {
    method: "get",
    url: `${ADMIN_URL}/status`,
    headers: { 'Content-Type': 'application/json'},
    data: data,
  }
  axios(config)
    .then(function(res) {
      console.log("controller - /health")
      //console.log(res)
      var results = res.data
      console.log(results)
      response.json(results)
    })
    .catch((error) => {
      console.error(error.response)
      response.status(500).send(error).end()
    })
})

app.get("/invitation", async (req, response) => {
  var config = {
    method: "get",
    url: `${ADMIN_URL}/wallet/did`,
    headers: {},
    data: "",
  };
  // get DID
  axios(config)
    .then((res) => {
      console.log("DID respose received")
      //console.log(res)
      var results = res.data.results[0].did
      REPO_DID = results
      console.log(REPO_DID)
      if (REPO_DID = ''){
        console.log('controller - get invitation - NO DID')
        response.status(500).send(error).end()
      }

      // invitation
      var inv_config = {
        method: "post",
        url: `${ADMIN_URL}/connections/create-invitation?multi_use=true`,
        headers: { 'Content-Type': 'application/json'},
        data: "",
      }
      axios(inv_config)
        .then((res) => {
          //changing annoying localhost in the invitation to the dockerhost
          var invitation = res.data.invitation
          console.log(invitation)
          console.log(REPO_DID)
          //invitation.serviceEndpoint = "192.168.65.3:8060"
          var invitation_config = { repo: REPO_DID, invitation }
          //console.log(config)
          response.json(invitation_config)
        })
        .catch((error) => {
          console.error(error.response)
          response.status(500).send(error).end()
        })
    })
    .catch((error) => {
      console.error(error.response);
      response.status(500).send(error).end();
    });
})

app.get("/get_public_did", async (req, response) => {
  var data = " ";
  var config = {
    method: "get",
    url: `${ADMIN_URL}/wallet/did`,
    headers: {},
    data: data,
  };
  axios(config)
    .then(function (res) {
      console.log("controller - get_public_did - respose received");
      //console.log(res)
      var results = res.data.results;
      REPO_DID = results[0].did;
      //console.log(results)
      response.json(results);
    })
    .catch((error) => {
      console.error(error.response);
      response.status(500).send(error).end();
    });
});

//
// create invitation using repo agent directly
// output can be used as .config.json for client
//
app.get("/create_invitation", async (req, response) => {
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
      var inv = JSON.parse(res.data.invitation)
      console.log(`invitation ${inv}`)
      //inv.serviceEndpoint = "http://192.168.65.3:8060"
      invitation = JSON.stringify(inv)
      var config = { repo: REPO_DID, invitation};

      //console.log(config)
      response.json(config);
    })
    .catch((error) => {
      console.error(error.response);
      response.status(500).send(error).end();
    });
});

//-----------------------------------------------------------------
//
//-----------------------------------------------------------------

// ----------------------------------------------------------------------------
// webhook routes - start
// ----------------------------------------------------------------------------

// webhooks
app.post("/webhooks/topic/:topicid", async (req, res) => {
  var topicId = req.params.topicid;
  console.log(`/webhooks/topic handler  ${topicId}`);
  //console.log(`/webhooks/topic body  ${req.body}`)

  // handle register use case
  if (topicId == "connections") {
    await handle_connections(req.body, res);
  }

  // this should handle publish
  else if (topicId == "issue_credential") {
    await handle_issue_credential(req.body, res);
  } 
  else {
    console.log(`/webhooks/topic handler - no handler  ${topicId}`);
    res.status(200).end();
  }
});

// handle connections
async function handle_connections(message, response) {
  // here repo should check connection_ids with the incoming connection_id
  // in this phase only one connection_id
  // from repo agent /connections/{conn_id}
  console.log(`webhook - handle_connections - connections respose received`)
  console.log(`connection_id ${message.connection_id} connection state - ${message.state}`)
  if ((message.state == "active") || (message.state == "response")){
    console.log('webhook - handle_connections - connected')
  }
  response.status(200).end()
}

// handle issue credentials
async function handle_issue_credential(message, response) {
  var state = message.state;
  console.log("webhook - handle issue credential");
  credential_exchange_id = message.credential_exchange_id;

  if (state == "offer_received") {
    console.log("webhook - handle_issue_credential - After receiving credential offer, send credential request");
    axios
      .post(
        `${ADMIN_URL}/issue-credential/records/${credential_exchange_id}/send-request`
      )
      .then((res) => {
        console.log(res);
        axios
          .get(`${ADMIN_URL}/issue-credential/records/${cred_id}/send-request`)
          .then((res) => {
            console.log(`webhook - handle_issue_credential - ${res}`);
            response.json(res.data);
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
  } else if (state == "credential_acked") {
    cred_id = message.credential_id;
    console.log("Stored credential " + cred_id + " in wallet");

    axios
      .get(`${ADMIN_URL}/credential/{cred_id}`)
      .then((res) => {
        console.log(res);
        response.json(res.data);
      })
      .catch((error) => {
        console.error(error.response);
        response.status(500).send(error).end();
      });
  }
}
// ------------------------------------------------------------------
// webhook
// -----------------------------------------------------------------

(async () => {
  await agent.start_agent();
})();

app.listen(port, () => {
  console.log(`VSW repo listening on port ${port}!`)
});


