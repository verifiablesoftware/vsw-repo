const { spawn } = require('child_process');
let exec =  require('child_process').exec, agent;
const os  = require('os');
const axios = require('axios').default;
const logger = require('./logger');


const DEFAULT_INTERNAL_HOST = `${process.env.DOCKERHOST}` || os.hostname().docker.internal;
const DEFAULT_EXTERNAL_HOST = `${process.env.EXTERNAL_HOST}` || `${process.env.DOCKERHOST}`;

const HTTP_PORT = `${process.env.HTTP_PORT}` || 8060;
const ADMIN_PORT = `${process.env.ADMIN_PORT}` || 8061;
const WEBHOOK_PORT = `${process.env.WEBHOOK_PORT}` || 8062;

const LEDGER_URL = process.env.LEDGER_URL || `http://${process.env.DOCKERHOST}:9000`;
const GENESIS_FILE = `${process.env.GENESIS_FILE}`;
const TAILS_URL = `${process.env.TAILS_URL}`;

var wallet_name = `${process.env.WALLET_NAME}`
var genesis_file = GENESIS_FILE;

/*  starting agent */
async function start() {
  await start_agent();
}


/* create agent arguments */
function get_agent_args() {
  let args = {};
  args = {
    "--endpoint": `http://${DEFAULT_EXTERNAL_HOST}:${HTTP_PORT}`,
    "--label": "Repo.Agent",
    "--preserve-exchange-records": "",
    "--admin-insecure-mode": "",
    "--inbound-transport": `http 0.0.0.0 ${HTTP_PORT}`,
    "--outbound-transport": "http ",
    "--admin": `0.0.0.0 ${ADMIN_PORT}`,
    "--log-level": "debug",
    "--genesis-file": genesis_file,
    "--webhook-url": `http://${DEFAULT_EXTERNAL_HOST}:${WEBHOOK_PORT}/webhooks`,
    "--wallet-type": "indy",
    "--wallet-name": wallet_name,
    "--wallet-key": wallet_name,
    "--trace-target": "log",
    "--trace-tag": "acapy.events",
    "--trace-label": "Repo.Agent.trace",
    "--auto-ping-connection": "",
    "--auto-respond-messages": "",
    "--auto-accept-invites": "",
    "--auto-accept-requests": "",
    "--auto-store-credential": "",
    "--auto-respond-credential-offer":"", // HAVE TO VERIFY THIS
    "--auto-respond-credential-proposal":"", // HAVE TO VERIFY THIS
    "--auto-respond-credential-request":"", // HAVE TO VERIFY THIS
    "--auto-verify-presentation":"", // HAVE TO VERIFY THIS
    "--auto-respond-presentation-request":"", // HAVE TO VERIFY THIS
    "--auto-respond-presentation-proposal":"", // HAVE TO VERIFY THIS
    "--log-file": "logs/agent.logs",
    "--public-invites": "", 
    "--tails-server-base-url":`${TAILS_URL}`
    //"--wallet-storage-type": "postgres_storage", // CURRENTLY USING SQLITE
    //"--wallet-storage-config": storage_config, // CURRENTLY USING SQLITE
    //"--wallet-storage-creds": postgres_config, // CURRENTLY USING SQLITE
    //"--seed": seed, // NOT NEEDED, WALLET USED
  };
  let str_arg = "";
  for (let key in args) {
    str_arg += key + " " + args[key] + " ";
  }
  return str_arg;
}

/* start the aca-py agent - wait for 10s to let agent startup. */
async function start_agent() {
    logger.info('Starting aca-py agent.')
    logger.info(get_agent_args());
    agent = exec("aca-py start " + get_agent_args(),
      function (error, stdout, stderr) {
        if (error) {
          logger.info('Starting aca-py agent failed.')
          logger.info(error.stack);
          console.log("Error code: " + error.code);
          console.log("Signal received: " + error.signal);
        }
      }
    );
    let promise = new Promise((resolve, reject) => {
      setTimeout(() => resolve(agent), 1000);
    });
  
    let result = await promise;
    logger.info("start aca-py agent completed");
    return result;
  }
  

module.exports = {
    start_agent
}
