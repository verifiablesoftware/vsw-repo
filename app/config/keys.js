// keys.js - figure out what set of credentials to return
// placeholder for different keys - to used yet
// 

let keys;

if (process.env.NODE_ENV === 'production') {
    // we are in production - return the prod set of keys
     keys = {
        storage_config : `\"{\\\"url\\\":\\\"${process.env.DOCKERHOST}:5432\\\",\\\"wallet_scheme\\\":\\\"MultiWalletSingleTable\\\"}\"`,
        postgres_config : "\"{\\\"account\\\":\\\"postgres\\\",\\\"password\\\":\\\"postgres\\\",\\\"admin_account\\\":\\\"postgres\\\",\\\"admin_password\\\":\\\"postgres\\\"}\"",
        seed : "my_seed_100000000000000000007777" // fix for now
      };
  } else {
    // we are in development - return the dev keys
     keys = {
    
        storage_config : `\"{\\\"url\\\":\\\"${process.env.DOCKERHOST}:5432\\\",\\\"wallet_scheme\\\":\\\"MultiWalletSingleTable\\\"}\"`,
        postgres_config : "\"{\\\"account\\\":\\\"postgres\\\",\\\"password\\\":\\\"postgres\\\",\\\"admin_account\\\":\\\"postgres\\\",\\\"admin_password\\\":\\\"postgres\\\"}\"",
        seed : "my_seed_100000000000000000007777"
      };
  }

  module.exports = keys;