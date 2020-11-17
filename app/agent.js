import {exec} from 'child_process';
import axios from 'axios';

const DEFAULT_INTERNAL_HOST = "127.0.0.1";
const DEFAULT_EXTERNAL_HOST = "localhost";
const HTTP_PORT = 8060;
const ADMIN_PORT = 8061;
const WEBHOOK_PORT = 8062;
const LEDGER_URL = process.env.LEDGER_URL || `http://${process.env.DOCKERHOST}:9000`

function start_agent() {
    console.log('start agent');
    let agent = exec('python3 /home/indy/bin/aca-py start ' + get_agent_args(), function (error, stdout, stderr) {
        if (error) {
          console.log(error.stack);
          console.log('Error code: '+error.code);
          console.log('Signal received: '+error.signal);
        }
    });

    console.log('Child Process STDOUT: '+ agent.stdout);

    //TODO:Eric for now wait 5s to allow agent startup, needs figure out how to get signal from the child process
    new Promise((resolve, reject) => {
        setTimeout(resolve, 5000);    
    }).then(() => {
        return issue_credential(); 
    })

    return agent;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

async function issue_credential() {
    let data = {"alias": 'Repo.Agent', "seed": "my_seed_00000000000000000000" + getRandomInt(9999), "role": "TRUST_ANCHOR"};
    axios
    .post(`http://${DEFAULT_INTERNAL_HOST}:${ADMIN_PORT}/wallet/did/create`)
    .then(res => {
        console.log('call agent to issue credidential');
        console.log(res.data);
        create_invitation();

    })
    .catch(error => {
        console.error(error);
    })
}

function get_agent_args() {
    let wallet_name = 'Repo.Agent' + Math.random();
    let args = {
        '--endpoint': `http://${DEFAULT_EXTERNAL_HOST}:${HTTP_PORT}`,
        '--label': 'Repo.Agent',
        '--admin-insecure-mode': '',
        '--inbound-transport': 'http 0.0.0.0 8060',
        '--outbound-transport': 'http ',
        '--admin': '0.0.0.0 8061',
        '--webhook-url': `http://${DEFAULT_EXTERNAL_HOST}:${WEBHOOK_PORT}/webhooks`,
        '--wallet-type': 'indy', //use indy wallet for now
        '--wallet-name': wallet_name,
        '--wallet-key': wallet_name
    };
    console.log(`webhook-url: http://${DEFAULT_EXTERNAL_HOST}:${WEBHOOK_PORT}/webhooks`)
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

export default {
    start_agent: start_agent,
    create_invitation: create_invitation
}