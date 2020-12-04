import agent from './agent.js'
import express from 'express'

const app = express()
import { Router } from 'express'
const port = process.env.PORT || 8062

//const LEDGER_URL = process.env.LEDGER_URL || `http://${process.env.DOCKERHOST}:9000`;
//const REPO_AGENT = process.env.REPO_AGENT || "http://localhost:8060";
//const ADMIN_URL = process.env.REPO_ADMIN || "http://localhost:8061";


//--------------------------------------------------------------------------
// utils routes
//---------------------------------------------------------------------------
import utilsRouter from './routes/utilsRoutes.js'
app.use('/utilsRoutes', utilsRouter);

//----------------------------------------------------------------------------
// Controller endpoints
//----------------------------------------------------------------------------
import controllerRouter from './routes/controllerRoutes.js'
app.use('/controllerRoutes', controllerRouter);

// ----------------------------------------------------------------------------
// webhook routes - start
// ----------------------------------------------------------------------------
import webhooks from './routes/webhookRoutes.js'
app.use('/webhooks', webhooks);


app.get("/", (req, res) => {
  res.status(200).end();
});

//-----------------------------------------------------------------------------
// start the repo agent
//-----------------------------------------------------------------------------
(async () => {
  await agent.start_agent();
})();

app.listen(port, () => {
  console.log(`VSW repo listening on port ${port}!`)
});


