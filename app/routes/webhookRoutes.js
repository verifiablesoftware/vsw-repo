// all the webhooks

import express, { response } from "express";
import { Router } from "express";
import axios from "axios";
import bodyParser from "body-parser";
import JSON from "json";
const ADMIN_URL = process.env.REPO_ADMIN || "http://localhost:8061";

let webhooks = Router()
  .use(bodyParser.json())
  // webhooks
  .post("/topic/:topicid", async (req, res) => {
    var topicId = req.params.topicid;
    console.log(`/webhooks/topic handler  ${topicId}`);
    console.log(`/webhooks/topic body  ${req.body}`);

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
      console.log(req);
      var message = req.body;
      var state = message.state;
      let credential_exchange_id = "";
      console.log(`webhook - handle issue credential - state ${state}`);
      if (message.credential_exchange_id) {
        credential_exchange_id = message.credential_exchange_id;
      }

      if (state == "offer_received") {
        console.log(
          "webhook - handle_issue_credential - After receiving credential offer, send credential request"
        );
        if (message.credential_exchange_id) {
          credential_exchange_id = message.credential_exchange_id;
          axios
            .post(
              `${ADMIN_URL}/issue-credential/records/${credential_exchange_id}/send-request`
            )
            .then((response) => {
              console.log(response);
              axios
                .get(`${ADMIN_URL}/issue-credential/records/${cred_id}/send-request`)
                .then((response_issue) => {
                  console.log(`webhook - handle_issue_credential - ${response_issue}`);
                  response_issue.status(200).end();
                })
                .catch((error) => {
                  console.error(error.response);
                  response_issue.status(500).send(error).end();
                });
            })
            .catch((error) => {
              console.error(error.response);
              response.status(500).send(error).end();
            });
        } else {
          console.log("webhook - handle_issue_credential - missing credential_exchange_id");
          response_issue.status(200).end();
        }
      } 
      else if (state == "credential_acked") {
        let cred_id = '';
        if (message.credential_definition_id) {
          cred_id = message.credential_definition_id;
          console.log("Stored credential " + cred_id + " in wallet");
          axios
            .get(`${ADMIN_URL}/credential/{cred_id}`)
            .then((response_credential) => {
              console.log(res);
              response_credential.status(200).end();
            })
            .catch((error) => {
              console.error(error.response);
              response.status(500).send(error).end();
            });
        }
        else {
          console.log(
            "webhook - handle_issue_credential - missing cred_id"
          );
          response_issue.status(200).end();
        }
      } 
      else {
        console.log("webhook - issue credential - no state");
        res.status(200).end();
      }
    }
    // no handler
    else {
      console.log(`/topic handler - no handler  ${topicId}`);
      res.status(200).end();
    }
  });

// ------------------------------------------------------------------
// webhook
// -----------------------------------------------------------------

export default webhooks;
