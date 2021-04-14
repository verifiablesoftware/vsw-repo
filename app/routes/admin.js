var express = require('express');
var router = express.Router();
const axios = require('axios').default;
const fs = require('fs');

const DEFAULT_EXTERNAL_HOST = `${process.env.EXTERNAL_HOST}` || `${process.env.DOCKERHOST}`;
const ADMIN_PORT = `${process.env.ADMIN_PORT}` || 8061;
const ADMIN_URL = `http://${DEFAULT_EXTERNAL_HOST}:${ADMIN_PORT}`

/** 
 * @swagger
 * /admin/health:
 *    get:
 *      summary: Get all connections
 *      tags: [health]
 *      requestBody:
 *        required: false
 *      responses:
 *        "200":
 *          description: Success
 */
router.get("/health", async (req, response) => {
  var data = " ";
  var config = {
    method: "get",
    url: `${ADMIN_URL}/status`,
    headers: { "Content-Type": "application/json" },
    data: data,
  };
  axios(config)
    .then(function (res) {
      console.log("/health");
      //console.log(res)
      var results = res.data;
      console.log(results);
      response.json(results);
    })
    .catch((error) => {
      console.error(error.response);
      response.status(500).send(error).end();
    });
});
/** 
 * @swagger
 * /admin/agentlogs:
 *    get:
 *      summary: Get the aca-py agent logs
 *      tags: [agentlogs]
 *      requestBody:
 *        required: false
 *      responses:
 *        "200":
 *          description: Success
 */
 router.get("/agentlogs", async (req, res) => {
  const logsPath =  __basedir + "/logs/agent.logs";
  res.download(logsPath, "agent.logs", (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
});



module.exports = router;