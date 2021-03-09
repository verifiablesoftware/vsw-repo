import { exec } from "child_process";
import axios from "axios";
import fs from "fs";
import Storage from "./storage.js";
import { hostname } from "os";
import keys from "./config/keys.js";
import variables from "./variables.js";

// agent in AWS
// http://ec2-3-138-121-46.us-east-2.compute.amazonaws.com/8060
// 
const DEFAULT_INTERNAL_HOST = `${process.env.DOCKERHOST}` || hostname.docker.internal;
const DEFAULT_EXTERNAL_HOST = `${process.env.EXTERNAL_HOST}` || `${process.env.DOCKERHOST}`;

const HTTP_PORT = `${process.env.HTTP_PORT}` || 8060;
const ADMIN_PORT = `${process.env.ADMIN_PORT}` || 8061;
const WEBHOOK_PORT = `${process.env.WEBHOOK_PORT}` || 8062;

const LEDGER_URL = process.env.LEDGER_URL || `http://${process.env.DOCKERHOST}:9000`;
const GENESIS_FILE = process.env.GENESIS_FILE;

// TODO: probably not needed 
const storage = new Storage();
let schema_id = 0;
let credential_definition_id = 0;
let schema_definition;
let did = variables.did;
//TODO: for postgres if needed
var storage_config = keys.storage_config;
var postgres_config = keys.postgres_config;

let seed; // = variables.seed;
var genesis_file = "home/indy/resources/genesis.txt";

/* starting agent from scratch */
async function start() {
  await start_agent();
}

/**
 * start the arise agent
 * wait for 10s to let agent startup.
 */
async function start_agent() {
  console.log("start agent");
  console.log(get_agent_args());
  let agent = exec(
    "/home/indy/bin/aca-py start " + get_agent_args(),
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

//register public did
async function register_public_did() {
  let data = { alias: "Repo.Agent", seed: seed, role: "TRUST_ANCHOR" };
  let res = await axios.post(`${LEDGER_URL}/register`, data);
  return res.data;
}

/**
 * get agent arguments
 */
function get_agent_args() {
  let wallet_name = "Repo.Agent";// + Math.random();
  let args = {};

  if (process.env.GENESIS_FILE != "") {
    // uses wallet information - no seed needed
    genesis_file = "/home/indy/resources/genesis.txt";
    args = {
      "--endpoint": `http://${DEFAULT_EXTERNAL_HOST}:${HTTP_PORT}`,
      "--label": "Repo.Agent",
      "--auto-ping-connection": "",
      "--auto-respond-messages": "",
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
      "--auto-store-credential": "",
      "--auto-respond-credential-offer": "",
      "--auto-respond-presentation-request": "",
      "--auto-verify-presentation": ""
      //"--log-file": "logs/agent.logs",
      //"--wallet-storage-type": "postgres_storage",
      //"--wallet-storage-config": storage_config,
      //"--wallet-storage-creds": postgres_config,
      //"--seed": seed,
    };
  } 
  // only relevant for local development  
  else {
    args = {
      "--endpoint": `http://${DEFAULT_EXTERNAL_HOST}:${HTTP_PORT}`,
      "--label": "Repo.Agent",
      "--auto-ping-connection": "",
      "--auto-respond-messages": "",
      "--preserve-exchange-records": "",
      "--admin-insecure-mode": "",
      "--inbound-transport": "http 0.0.0.0 8060",
      "--outbound-transport": "http ",
      "--admin": "0.0.0.0 8061",
      "--log-level": "debug",
      "--genesis-url": `${LEDGER_URL}/genesis`,
      "--webhook-url": `http://${DEFAULT_INTERNAL_HOST}:${WEBHOOK_PORT}/webhooks`,
      "--wallet-type": "indy", //use indy wallet for now
      "--wallet-name": wallet_name,
      "--wallet-key": wallet_name,
      "--trace-target": "log",
      "--trace-tag": "acapy.events",
      "--trace-label": "Repo.Agent.trace",
      "--auto-accept-invites": "",
      "--auto-accept-requests": "",
      "--auto-store-credential": "",
      "--auto-respond-credential-offer": "",
      "--auto-respond-presentation-request": "",
      "--auto-verify-presentation": ""
      //"--log-file": "logs/agent.logs",
      //"--wallet-storage-type": "postgres_storage",
      //"--wallet-storage-config": storage_config,
      //"--wallet-storage-creds": postgres_config,
    };
  }
  let str_arg = "";
  for (let key in args) {
    str_arg += key + " " + args[key] + " ";
  }
  return str_arg;
}

function register_schema_and_creddef() {
  let schema_body = schema_definition.schema_body;
  axios
    .post(`http://${DEFAULT_INTERNAL_HOST}:${ADMIN_PORT}/schemas`, schema_body)
    .then((res) => {
      schema_id = res.data.schema_id;
      console.log("schema created id is {" + schema_id + "}");
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
        .then((res) => {
          credential_definition_id = res.data.credential_definition_id;
          console.log("Cred def ID:" + credential_definition_id);
        })
        .catch((error) => console.log(error));
    })
    .catch((error) => {
      console.error(error);
    });
}

function load_schema_definition() {
  let rawdata = fs.readFileSync("resources/schema.definition.json");
  schema_definition = JSON.parse(rawdata);
  console.log(schema_definition);
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

/*
 * get did - if no
 */
async function get_did() {
  // this should be checked. e.g. how to remove the DID
  let public_did = await storage.get_did();
  let stored_did = false;
  if (public_did) {
    console.log("get public did from aws: " + public_did.did);
    stored_did = true;
  } else {
    public_did = await register_public_did();
    storage.store_did(public_did);
    console.log("register public did: " + public_did.did);
  }
  public_did.stored_did = stored_did;
  return public_did;
}

export default {
  start_agent: start,
};
