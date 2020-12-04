
import express from 'express'
import { Router } from 'express'
import axios from "axios";
const ADMIN_URL = process.env.REPO_ADMIN || "http://localhost:8061";

// healts
// check did
// reset DID?
let utilsRoutes = Router()

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

export default  utilsRoutes ;

