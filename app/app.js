import agent from './agent.js'
import express from 'express'
import bodyParser from 'body-parser'
import logger from 'morgan';

const app = express()
import { Router } from 'express'
const port = process.env.WEBHOOK_PORT || 8062

import keys from './config/keys.js'

app.get('env');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

import dbRouter from './queries.js';
app.use('/dbRoutes', dbRouter);

import adminRouter from './routes/adminRoutes.js'
app.use('/adminRoutes', adminRouter);

import controllerRouter from './routes/controllerRoutes.js'
app.use('/controllerRoutes', controllerRouter);

import webhooks from './routes/webhookRoutes.js'
app.use('/webhooks', webhooks);


app.get("/", (req, res) => {
  console.log(`ADMIN_PORT : ${process.env.ADMIN_PORT}`)
  console.log(`WEBHOOK_PORT : ${process.env.WEBHOOK_PORT}`)
  console.log(`HTTP_PORT : ${process.env.HTTP_PORT}`)

  var settings = {
    "DOCKERHOST": `${process.env.DOCKERHOST}`,
    "EXTERAL_HOST": `${process.env.EXTERNAL_HOST}`,
    "ADMIN_PORT" : `${process.env.ADMIN_PORT}`,
    "WEBHOOK_PORT" : `${process.env.WEBHOOK_PORT}`,
    "HTTP_PORT" : `${process.env.HTTP_PORT}`,
    "GENESIS_FILE": `${process.env.GENESIS_FILE}`,
    "WALLET_NAME": `${process.env.WALLET_NAME}`,
  }
  res.json(settings);
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
