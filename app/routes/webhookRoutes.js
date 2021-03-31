// all the webhooks

import express, { response } from "express";
import { Router } from "express";
import axios from "axios";
import bodyParser from "body-parser";
import JSON from "json";

const DEFAULT_INTERNAL_HOST = `${process.env.DOCKERHOST}` || hostname.docker.internal;
const DEFAULT_EXTERNAL_HOST = `${process.env.EXTERNAL_HOST}` || `${process.env.DOCKERHOST}`;

const HTTP_PORT = `${process.env.HTTP_PORT}` || 8060;
const ADMIN_PORT = `${process.env.ADMIN_PORT}` || 8061;
const WEBHOOK_PORT = `${process.env.WEBHOOK_PORT}` || 8062;

const ADMIN_URL = `http://${DEFAULT_EXTERNAL_HOST}:${ADMIN_PORT}`

let webhooks = Router()
  .use(bodyParser.json())
  // webhooks
  .post("/topic/:topicid", async (req, res) => {
    var topicId = req.params.topicid;
    console.log(`/webhooks/topic handler  ${topicId}`);
  
    // handle register use case
    if (topicId == "connections") {
      var message = req.body;
      if (message) {
        console.log(
          `webhook connection_id ${message.connection_id} connection state - ${message.state}`
        );
        if (message.state == "active" || message.state == "response") {
          console.log("webhook - handle_connections - connected");
        }
      }
      res.status(200).end();
    }

    // this should handle publish
    else if (topicId == "issue_credential") {
      //console.log(req);
      var message = req.body;
      var state = message.state;
      let credential_exchange_id = "";
      
      if (message.credential_exchange_id) {
        credential_exchange_id = message.credential_exchange_id;
      }

      if (state == "offer_received") {
        console.log(`webhook - handle issue credential - state ${state}`);
        if (message.credential_exchange_id) {
          credential_exchange_id = message.credential_exchange_id;
          console.log(`webhook - credential request ${credential_exchange_id}`)
         
          /* this is not needed for auto response? 
          axios
            .post(
              `${ADMIN_URL}/issue-credential/records/${credential_exchange_id}/send-request`
            )
            .then((response) => {
              console.log(`webhook - send credential request /issue-credential/records/${credential_exchange_id}/send-request - response received ${response.status}`)
              res.status(200).end();
            })
            .catch((error) => {
              console.error(error.response);
            });*/
            res.status(200).end();
        } 
        else {
          console.log("webhook - handle_issue_credential - missing credential_exchange_id");
          res.status(200).end();
        }
      }
      else if (state == "request_sent") {
        console.log(`webhook - handle issue credential - state ${state}`);
        res.status(200).end();
      }
      else if (state == "credential_received") {
        console.log(`webhook - handle issue credential - state ${state}`);
        res.status(200).end();
      }

      else if (state == "credential_acked") {
        console.log(`webhook - handle issue credential - state ${state}`);
        let credential_id = '';
        if (message.credential_id) {
          credential_id = message.credential_id;
          console.log("Stored credential " + credential_id + " in wallet");
          var data = '';
          var config = {
            method: 'get',
            url:`${ADMIN_URL}/credential/${credential_id}`,
            data: data
          };
          axios(config)
          .then((response) => {
            console.log(`${ADMIN_URL}/credential/${credential_id}`);
            res.status(200).end();
          })
          .catch((error) => {
            console.error(error.response);
            //response.status(500).send(error).end();
          });
        }
        else {
          console.log(
            "webhook - handle_issue_credential - missing cred_id"
          );
          res.status(200).end();
        }
      } 
      else if (state == "proposal_sent"){
        console.log(`webhook - handle issue credential - ${state}`);
        res.status(200).end();
      }
     
      else {
        console.log(`webhook - handle issue credential - state ? ${state}`);
        res.status(200).end();
      }
    }
    else if (topicId == "revocation_registry") {
      let message = req.body;
      let state = message.state;
      let cred_def_id = message.cred_def_id;
      console.log(`/topic handler -  ${topicId} - cred_def_id - ${cred_def_id} state - ${state}`);

    }
    // no handler
    else {
      console.log(`/topic handler - no handler for this topic  ${topicId}`);
      res.status(200).end();
    }
  });

// ------------------------------------------------------------------
// webhook
// -----------------------------------------------------------------

export default webhooks;
