import {exec} from 'child_process';
import axios from 'axios';
import fs from "fs";
import Storage from './storage.js';

const DEFAULT_INTERNAL_HOST = "localhost";
const DEFAULT_EXTERNAL_HOST = "localhost";
const HTTP_PORT = 8060;
const ADMIN_PORT = 8061;
const WEBHOOK_PORT = 8062;
const LEDGER_URL = process.env.LEDGER_URL || `http://${process.env.DOCKERHOST}:9000`;
const storage = new Storage();

//TODO: will need move variable into class
let schema_id = 0;
let credential_definition_id = 0;
let schema_definiation;
let seed = 0
let did = ''

/**
 * start the agent in child process
 * 
 * steps
 * 1. issue credential - call ledger register endpoint
 * 2. start agent with the correct seed
 * 2. create invitation
 * 3. create schema
 * 4. register schema
 */
function start_agent() {
    console.log('start agent');
    seed = "my_seed_00000000000000000000" + getRandomInt(9999);
    load_schema_definiation();

    issue_credential(); 
}

function load_schema_definiation() {
    let rawdata = fs.readFileSync('resources/schema.defination.json');
    schema_definiation = JSON.parse(rawdata);
    console.log(schema_definiation);
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  /**
   * issue credential from local agent
   */
async function issue_credential() {
    let data = {"alias": 'Repo.Agent', "seed": seed, "role": "TRUST_ANCHOR"};
    let public_did = await storage.get_did();
    let stored_did = false;
    if (public_did) {
        console.log("get public did from aws: " + public_did.did);
        stored_did = true;
        seed = public_did.seed;
    } else {
        public_did = await register_public_did();
        storage.store_did(public_did);
        console.log("register public did: " + public_did.did);
    }
    did = public_did.did;
    let agent = exec('python3 /home/indy/bin/aca-py start ' + get_agent_args(), function (error, stdout, stderr) {
        if (error) {
        console.log(error.stack);
        console.log('Error code: '+error.code);
        console.log('Signal received: '+error.signal);
        }
    });
    //TODO:Eric for now wait 5s to allow agent startup, needs figure out how to get signal from the child process
    new Promise((resolve, reject) => {
        setTimeout(resolve, 10000);    
    }).then(() => {
        create_invitation();
        if (!stored_did) {
            register_schema_and_creddef();
        }
    })
}

//register public did
async function register_public_did() {
    let data = {"alias": 'Repo.Agent', "seed": seed, "role": "TRUST_ANCHOR"};
    let res = await axios.post(`${LEDGER_URL}/register`, data);

    return res.data;
}

/**
 * get agent arguments
 */
function get_agent_args() {
    console.log(`${LEDGER_URL}/genesis`);
    let wallet_name = 'Repo.Agent' + Math.random();
    console.log(seed);
    let args = {
        '--endpoint': `http://${DEFAULT_EXTERNAL_HOST}:${HTTP_PORT}`,
        '--label': 'Repo.Agent',
        '--auto-ping-connection': '',
        '--auto-respond-messages': '',
        '--preserve-exchange-records': '',
        '--admin-insecure-mode': '',
        '--inbound-transport': 'http 0.0.0.0 8060',
        '--outbound-transport': 'http ',
        '--admin': '0.0.0.0 8061',
        '--log-file': 'logs/agent.logs',
        '--log-level': 'debug',
        '--genesis-url': `${LEDGER_URL}/genesis`,
        '--webhook-url': `http://${DEFAULT_EXTERNAL_HOST}:8000/webhooks`,
        '--wallet-type': 'indy', //use indy wallet for now
        '--wallet-name': wallet_name,
        '--wallet-key': wallet_name,
        '--seed': seed,
        '--trace-target': 'log',
        '--trace-tag': 'acapy.events',
        '--trace-label': 'Repo.Agent.trace',
        '--auto-accept-invites': '',
        '--auto-accept-requests': '',
        '--auto-store-credential': ''
    };
    let str_arg = '';
    for (let key in args) {
        str_arg += key + ' ' + args[key] + ' ';
    }
    return str_arg;
}

async function create_invitation() {
    axios.post(`http://${DEFAULT_INTERNAL_HOST}:${ADMIN_PORT}/connections/create-invitation?auto_accept=true&multi_use=true`)
        .then(res => {
            console.log(res.data)
        }).catch(error => {
            console.error(error);
        })
}

function register_schema_and_creddef() {
    let schema_body = schema_definiation.schema_body;

    axios.post(`http://${DEFAULT_INTERNAL_HOST}:${ADMIN_PORT}/schemas`, schema_body)
        .then(res => {
            schema_id = res.data.schema_id
            console.log("schema created id is {" + schema_id + "}");
            let credential_definition_body = {
                "schema_id": schema_id,
                "support_revocation": schema_definiation.support_revocation,
                "revocation_registry_size": schema_definiation.revocation_registry_size,
            };
            axios.post(
                `http://${DEFAULT_INTERNAL_HOST}:${ADMIN_PORT}/credential-definitions`, credential_definition_body
            ).then(res => {
                credential_definition_id = res.data.credential_definition_id
                console.log("Cred def ID:" + credential_definition_id)
            }).catch(error => console.log(error));
            
        }).catch(error => {
            console.error(error);
        })
}

export default {
    start_agent: start_agent,
    create_invitation: create_invitation
}