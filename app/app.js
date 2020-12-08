import agent from './agent.js'
import express from 'express'

const app = express()
import { Router } from 'express'
const port = process.env.PORT || 8062

import keys from './config/keys.js'



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
  console.log(`keys : ${keys.WEBHOOK_2}`)
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


