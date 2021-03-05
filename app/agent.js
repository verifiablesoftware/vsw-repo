import { exec } from "child_process";
import { hostname } from "os";
import keys from "./config/keys.js";
import Storage from "./storage.js";

import variables from "./variables.js";
import axios from "axios";
import fs from "fs";

const DEFAULT_INTERNAL_HOST = `${process.env.DOCKERHOST}` || hostname.docker.internal;
const DEFAULT_EXTERNAL_HOST = `${process.env.EXTERNAL_HOST}` || `${process.env.DOCKERHOST}`;

const HTTP_PORT = `${process.env.HTTP_PORT}` || 8060;
const ADMIN_PORT = `${process.env.ADMIN_PORT}` || 8061;
const WEBHOOK_PORT = `${process.env.WEBHOOK_PORT}` || 8062;

const LEDGER_URL = process.env.LEDGER_URL || `http://${process.env.DOCKERHOST}:9000`;
const GENESIS_FILE = `${process.env.GENESIS_FILE}`;

var wallet_name = `${process.env.WALLET_NAME}`
var genesis_file = GENESIS_FILE;

const storage = new Storage();
var storage_config = keys.storage_config;
var postgres_config = keys.postgres_config;

/*  starting agent */
async function start() {
  await start_agent();
}

/* start the aca-py agent - wait for 10s to let agent startup. */
async function start_agent() {
  console.log("Starting agent");
  console.log(get_agent_args());
  let agent = exec("aca-py start " + get_agent_args(),
    function (error, stdout, stderr) {
      if (error) {
        console.log(error.stack);
        console.log("Error code: " + error.code);
        console.log("Signal received: " + error.signal);
      }
    }
  );
  let promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve(agent), 10000);
  });

  let result = await promise;
  console.log("start agent completed");
  return result;
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
    "--auto-accept-invites": "",
    "--auto-accept-requests": "",
    "--auto-ping-connection": "",
    "--auto-respond-messages": "",
    //"--auto-respond-credential-proposal":"", // HAVE TO VERIFY THIS
    //"--auto-respond-credential-offer":"", // HAVE TO VERIFY THIS
    //"--auto-respond-credential-request":"", // HAVE TO VERIFY THIS
    "--auto-store-credential": "",
    //"--auto-respond-presentation-request":"", // HAVE TO VERIFY THIS
    //"--auto-verify-presentation":"", // HAVE TO VERIFY THIS
    //"--auto-respond-presentation-proposal":"", // HAVE TO VERIFY THIS
    "--log-file": "logs/agent.logs",
    //"--public-invites": "" // HAVE TO VERIFY THIS
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


export default {
  start_agent: start,
};
