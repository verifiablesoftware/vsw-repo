import { exec } from "child_process";
import axios from "axios";
import fs from "fs";
import Storage from "./storage.js";
import { hostname } from "os";

// agent.py 
const DEFAULT_INTERNAL_HOST = `${process.env.DOCKERHOST}` || hostname.docker.internal;
const DEFAULT_EXTERNAL_HOST = DEFAULT_INTERNAL_HOST;
const HTTP_PORT = 8060;
const ADMIN_PORT = 8061;
const WEBHOOK_PORT = 8062;
const LEDGER_URL = process.env.LEDGER_URL || `http://${process.env.DOCKERHOST}:9000`;
const storage = new Storage();

//TODO: will need move variable into class
let schema_id = 0;
let credential_definition_id = 0;
let schema_definition;
let seed = 0;
let did = "";

/**
 * start the agent in child process
 * steps
 * 1. issue credential - call ledger register endpoint
 * 2. start agent with the correct seed
 * 2. create invitation
 * 3. create schema
 * 4. register schema
 */

async function start() {
  seed = "my_seed_00000000000000000000" + getRandomInt(9999);
  load_schema_definition();
  const public_did = await get_did();
  did = public_did.did;
  seed = public_did.seed;
  await start_agent();

  //if the did is from aws, no need register schema again
  if (!public_did.stored_did) {
    register_schema_and_creddef();
  }
}

function load_schema_definition() {
  let rawdata = fs.readFileSync("resources/schema.definition.json");
  schema_definition = JSON.parse(rawdata);
  console.log(schema_definition);
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

/**
 * get did
 * if no public did found in aws, create one and store it
 */
async function get_did() {
  let public_did// = await storage.get_did();
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

/**
 * start the arise agent
 * wait for 10s to let agent startup.
 */
async function start_agent() {
  console.log("start agent");
  let agent = exec(
    "python3 /home/indy/bin/aca-py start " + get_agent_args(),
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
  console.log(`${LEDGER_URL}/genesis`);
  let wallet_name = "Repo.Agent" + Math.random();
  console.log(seed);
  let args = {
    "--endpoint": `http://${DEFAULT_EXTERNAL_HOST}:${HTTP_PORT}`,
    "--label": "Repo.Agent",
    "--auto-ping-connection": "",
    "--auto-respond-messages": "",
    "--preserve-exchange-records": "",
    "--admin-insecure-mode": "",
    "--inbound-transport": "http 0.0.0.0 8060",
    "--outbound-transport": "http ",
    "--admin": "0.0.0.0 8061",
    "--log-file": "logs/agent.logs",
    "--log-level": "debug",
    "--genesis-url": `${LEDGER_URL}/genesis`,
    "--webhook-url": `http://${DEFAULT_EXTERNAL_HOST}:8062/webhooks`,
    "--wallet-type": "indy", //use indy wallet for now
    "--wallet-name": wallet_name,
    "--wallet-key": wallet_name,
    "--seed": seed,
    "--trace-target": "log",
    "--trace-tag": "acapy.events",
    "--trace-label": "Repo.Agent.trace",
    "--auto-accept-invites": "",
    "--auto-accept-requests": "",
    "--auto-store-credential": "",
  };
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

export default {
  start_agent: start,
};
