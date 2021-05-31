var express = require('express');
var router = express.Router();
const axios = require('axios').default;
const fs = require('fs');
const logger = require('../logger');


const DEFAULT_EXTERNAL_HOST = `${process.env.EXTERNAL_HOST}` || `${process.env.DOCKERHOST}`;
const ADMIN_PORT = `${process.env.ADMIN_PORT}` || 8061;
const ADMIN_URL = `http://${DEFAULT_EXTERNAL_HOST}:${ADMIN_PORT}`
var wallet_name = `${process.env.WALLET_NAME}`

/** 
 * @swagger
 * /admin/intro:
 *    get:
 *      summary: Get all connections
 *      tags: [intro]
 *      requestBody:
 *        required: false
 *      responses:
 *        "200":
 *          description: Success
 */
 router.get("/intro", async (req, res) => {
  logger.info("/intro");
  let readmePath =  __basedir + '/readme/INTRO.html'
  if (DEFAULT_EXTERNAL_HOST === "127.0.0.1")
    readmePath =  __basedir + '/readme/INTRO_local.html'
  console.log(DEFAULT_EXTERNAL_HOST)
  res.sendFile(readmePath);
  
});

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
  logger.info("/health");
  var data = " ";
  var config = {
    method: "get",
    url: `${ADMIN_URL}/status`,
    headers: { "Content-Type": "application/json" },
    data: data,
  };
  axios(config)
    .then(function (res) {
      var results = res.data;
      response.json(results);
    })
    .catch((error) => {
      logger.error(error.response);
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
  logger.info("/agentlogs");
  const logsPath =  __basedir + "/logs/agent.logs";
  res.download(logsPath, "agent.logs", (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
});
/** 
 * @swagger
 * /admin/repologs:
 *    get:
 *      summary: Get the vsw-repo logs
 *      tags: [repologs]
 *      requestBody:
 *        required: false
 *      responses:
 *        "200":
 *          description: Success
 */
 router.get("/repologs", async (req, res) => {
  logger.info("/repologs");
  const logsPath =  __basedir + "/logs/app.logs";
  res.download(logsPath, "app.logs", (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
});

/** 
 * @swagger
 * /admin/wallet:
 *    get:
 *      summary: Get the vsw-repo wallet
 *      tags: [wallet]
 *      requestBody:
 *        required: false
 *      responses:
 *        "200":
 *          description: Success
 */
 router.get("/wallet", async (req, res) => {
  logger.info("/wallet");
  const wallet_string = `/.indy_client/wallet/${wallet_name}/sqlite.db-wal`
  const homeDir = require('os').homedir();
  const walletPath = homeDir + wallet_string.split(" ").join("");
  res.download(walletPath, "wallet.data", (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
});


module.exports = router;