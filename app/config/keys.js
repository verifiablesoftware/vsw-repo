// keys.js - figure out what set of credentials to return
// placeholder for different keys - to used yet
// 

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
        LEDGER_URL: `http://${process.env.DOCKERHOST}:9000`,
        REPO_AGENT: "http://localhost:8060",
        ADMIN_URL: "http://localhost:8061",
        WEBHOOK: "8062_DEV",
        storage_config : `\"{\\\"url\\\":\\\"${process.env.DOCKERHOST}:5432\\\",\\\"wallet_scheme\\\":\\\"MultiWalletSingleTable\\\"}\"`,
        postgres_config : "\"{\\\"account\\\":\\\"postgres\\\",\\\"password\\\":\\\"postgres\\\",\\\"admin_account\\\":\\\"postgres\\\",\\\"admin_password\\\":\\\"postgres\\\"}\"",
        seed : "my_seed_100000000000000000007777"

      };
  }

  export default keys ;