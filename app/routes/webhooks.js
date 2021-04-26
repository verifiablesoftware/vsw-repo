var express = require('express');
var router = express.Router();
const axios = require('axios').default;
const logger = require('../logger');


const DEFAULT_EXTERNAL_HOST = `${process.env.EXTERNAL_HOST}` || `${process.env.DOCKERHOST}`;
const ADMIN_PORT = `${process.env.ADMIN_PORT}` || 8061;
const ADMIN_URL = `http://${DEFAULT_EXTERNAL_HOST}:${ADMIN_PORT}`

/* VSW Repo - POST webhooks  */

router.post('/topic/:topicid', async (req, res) => {
    var topicId = req.params.topicid;
    logger.info(`/webhooks/topic handler  ${topicId}`);
  
    // handle register use case
    if (topicId == "connections") {
      var message = req.body;
      if (message) {
        logger.info(`webhook connection_id ${message.connection_id} connection state - ${message.state}`);
        if (message.state == "active" || message.state == "response") {
          logger.info("webhook - handle_connections - connected");
        }
      }
      res.status(200).end();
    }

    // this should handle publish
    else if (topicId == "issue_credential") {
      var message = req.body;
      var state = message.state;
      let credential_exchange_id = "";
      
      if (message.credential_exchange_id) {
        credential_exchange_id = message.credential_exchange_id;
      }

      if (state == "offer_received") {
        logger.info(`webhook - handle issue credential - state ${state}`);
        if (message.credential_exchange_id) {
          credential_exchange_id = message.credential_exchange_id;
          logger.info(`webhook - credential request ${credential_exchange_id}`)
         
          /* removed - this is not needed for auto response setting? 
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
          logger.info("webhook - handle_issue_credential - missing credential_exchange_id");
          res.status(200).end();
        }
      }
      else if (state == "request_sent") {
        logger.info(`webhook - handle issue credential - state ${state}`);
        res.status(200).end();
      }
      else if (state == "credential_received") {
        logger.info(`webhook - handle issue credential - state ${state}`);
        res.status(200).end();
      }

      else if (state == "credential_acked") {
        logger.info(`webhook - handle issue credential - state ${state}`);
        let credential_id = '';
        if (message.credential_id) {
          credential_id = message.credential_id;
          logger.info("Stored credential " + credential_id + " in wallet");
          var data = '';
          var config = {
            method: 'get',
            url:`${ADMIN_URL}/credential/${credential_id}`,
            data: data
          };
          axios(config)
          .then((response) => {
            logger.info(`${ADMIN_URL}/credential/${credential_id}`);
            res.status(200).end();
          })
          .catch((error) => {
            console.error(error.response);
            //response.status(500).send(error).end();
          });
        }
        else {
          logger.info("webhook - handle_issue_credential - missing cred_id");
          res.status(200).end();
        }
      } 
      else if (state == "proposal_sent"){
        logger.info(`webhook - handle issue credential - ${state}`);
        res.status(200).end();
      }
     
      else {
        logger.info(`webhook - handle issue credential - state ? ${state}`);
        res.status(200).end();
      }
    }
    else if (topicId == "revocation_registry") {
      let message = req.body;
      let state = message.state;
      let cred_def_id = message.cred_def_id;
      logger.info(`webhook - /topic handler -  ${topicId} - cred_def_id - ${cred_def_id} state - ${state}`);
      res.status(200).end();
    }
    else if (topicId == "present_proof") {
      let message = req.body;
      let state = message.state;
      logger.info(`webhook - /topic handler -  ${topicId} - ${state}`);
      res.status(200).end();
    }
    // no handler
    else {
      logger.info(`webhook - /topic handler - no handler currently for this topic  ${topicId}`);
      res.status(200).end();
    }
});

module.exports = router;
