// keys.js - figure out what set of credentials to return
// placeholder for different keys - to used yet
// 

 /*
Wallet type: indy
Wallet name: Repo.Agent
Created new public DID: Uydd2JEPUD63btdQAHJ25g
Verkey: GFPaV71sU4qm6S1b4u4JCad8MM7FSSyJAFu8THnW9fB9
seed my_seed_100000000000000000007777

{"statusCode":200,
"headers":{"Access-Control-Allow-Origin":"*"},
"body":"{\"statusCode\": 200, \"Uydd2JEPUD63btdQAHJ25g\": 
{\"status\": \"Success\", 
\"statusCode\": 200, 
\"reason\": 
\"Successfully wrote NYM identified by Uydd2JEPUD63btdQAHJ25g to the ledger with role ENDORSER\"}}"
}
*/

let keys;

if (process.env.NODE_ENV === 'production') {
    // we are in production - return the prod set of keys
     keys = {
        LEDGER_URL: `http://${process.env.DOCKERHOST}:9000`,
        AGENT_PORT: `${process.env.ADMIN_PORT}`,
        ADMIN_PORT: `${process.env.ADMIN_PORT}`,
        WEBHOOK_PORT: `${process.env.WEBHOOK_PORT}`,
        storage_config : `\"{\\\"url\\\":\\\"${process.env.DOCKERHOST}:5432\\\",\\\"wallet_scheme\\\":\\\"MultiWalletSingleTable\\\"}\"`,
        postgres_config : "\"{\\\"account\\\":\\\"postgres\\\",\\\"password\\\":\\\"postgres\\\",\\\"admin_account\\\":\\\"postgres\\\",\\\"admin_password\\\":\\\"postgres\\\"}\"",
        seed : "my_seed_100000000000000000007777" // fiex for now
      };
  } else {
    // we are in development - return the dev keys!!!
     keys = {
        LEDGER_URL_2: `http://${process.env.DOCKERHOST}:9000`,
        REPO_AGENT_2: "http://localhost:8060",
        ADMIN_URL_2: "http://localhost:8061",
        WEBHOOK_2: "8062_DEV",
        storage_config : `\"{\\\"url\\\":\\\"${process.env.DOCKERHOST}:5432\\\",\\\"wallet_scheme\\\":\\\"MultiWalletSingleTable\\\"}\"`,
        postgres_config : "\"{\\\"account\\\":\\\"postgres\\\",\\\"password\\\":\\\"postgres\\\",\\\"admin_account\\\":\\\"postgres\\\",\\\"admin_password\\\":\\\"postgres\\\"}\"",
        seed : "my_seed_100000000000000000007777"

      };
  }

  export default keys ;