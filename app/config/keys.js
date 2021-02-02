// keys.js - figure out what set of credentials to return
// placeholder for different keys - to used yet
// 
let keys;

if (process.env.NODE_ENV === 'production') {
    // we are in production - return the prod set of keys
     keys = {
        LEDGER_URL_2: `http://${process.env.DOCKERHOST}:9000`,
        REPO_AGENT_2: "http://localhost:8060",
        ADMIN_URL_2: "http://localhost:8061",
        WEBHOOK_2: "8062",
        storage_config : `\"{\\\"url\\\":\\\"${process.env.DOCKERHOST}:5432\\\",\\\"wallet_scheme\\\":\\\"MultiWalletSingleTable\\\"}\"`,
        postgres_config : "\"{\\\"account\\\":\\\"postgres\\\",\\\"password\\\":\\\"postgres\\\",\\\"admin_account\\\":\\\"postgres\\\",\\\"admin_password\\\":\\\"postgres\\\"}\""

      };
  } else {
    // we are in development - return the dev keys!!!
     keys = {
        LEDGER_URL_2: `http://${process.env.DOCKERHOST}:9000`,
        REPO_AGENT_2: "http://localhost:8060",
        ADMIN_URL_2: "http://localhost:8061",
        WEBHOOK_2: "8062_DEV",
        storage_config : `\"{\\\"url\\\":\\\"${process.env.DOCKERHOST}:5432\\\",\\\"wallet_scheme\\\":\\\"MultiWalletSingleTable\\\"}\"`,
        postgres_config : "\"{\\\"account\\\":\\\"postgres\\\",\\\"password\\\":\\\"postgres\\\",\\\"admin_account\\\":\\\"postgres\\\",\\\"admin_password\\\":\\\"postgres\\\"}\""
      };
  }

  export default keys ;