
import express from 'express'
import { Router } from 'express'
import axios from "axios";

const DEFAULT_INTERNAL_HOST = `${process.env.DOCKERHOST}` || hostname.docker.internal;
const DEFAULT_EXTERNAL_HOST = `${process.env.EXTERNAL_HOST}` || `${process.env.DOCKERHOST}`;

const HTTP_PORT = `${process.env.HTTP_PORT}` || 8060;
const ADMIN_PORT = `${process.env.ADMIN_PORT}` || 8061;
const WEBHOOK_PORT = `${process.env.WEBHOOK_PORT}` || 8062;

const ADMIN_URL = `http://${DEFAULT_EXTERNAL_HOST}:${ADMIN_PORT}`

// healts
// check did
// reset DID?
let adminRoutes = Router()

  //utilsRoutes(app)
  .get("/health", async (req, response) => {
    var data = " ";
    var config = {
      method: "get",
      url: `${ADMIN_URL}/status`,
      headers: { "Content-Type": "application/json" },
      data: data,
    };
    axios(config)
      .then(function (res) {
        console.log("utilsRoutes - /health");
        //console.log(res)
        var results = res.data;
        console.log(results);
        response.json(results);
      })
      .catch((error) => {
        console.error(error.response);
        response.status(500).send(error).end();
      });
  });

export default  adminRoutes ;

