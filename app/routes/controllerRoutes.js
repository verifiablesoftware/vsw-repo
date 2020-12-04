import express from 'express'
import { Router } from 'express'
import axios from "axios";
const ADMIN_URL = process.env.REPO_ADMIN || "http://localhost:8061";

//  controller routes
let REPO_DID = ''

let controllerRoutes = Router()

  .get("/invitation", async (req, response) => {
    var config = {
            method: "get",
            url: `${ADMIN_URL}/wallet/did`,
            headers: {},
            data: "",
        };
        // get DID
        axios(config)
        .then((res) => {
            console.log("DID respose received")
            //console.log(res)
            var results = res.data.results[0]
            REPO_DID = results.did
        
            if (REPO_DID == ''){
                console.log('controller - get invitation - NO DID')
            }
            else {
                console.log(`rep DID: ${REPO_DID}`)
            }
             // invitation
            var inv_config = {
                method: "post",
                url: `${ADMIN_URL}/connections/create-invitation?multi_use=true`,
                headers: { 'Content-Type': 'application/json'},
                data: "",
            }
            axios(inv_config)
                .then((res) => {
                    //changing annoying localhost in the invitation to the dockerhost
                    var invitation = res.data.invitation
                    console.log(invitation)
                console.log(REPO_DID)
                var invitation_config = { repo: REPO_DID.toString(), invitation }
                //console.log(config)
                response.json(invitation_config)
                })
                .catch((error) => {
                    console.error(error.response)
                    response.status(500).send(error).end()
                })
        })
        .catch((error) => {
            console.error(error.response);
            response.status(500).send(error).end();
        })
    })
    
  .get("/get_public_did", async (req, response) => {
    var data = " ";
    var config = {
      method: "get",
      url: `${ADMIN_URL}/wallet/did`,
      headers: {},
      data: data,
    };
    axios(config)
      .then(function (res) {
        console.log("controllerRoutes - get_public_did - respose received")
        //console.log(JSON.stringify(res.data.results))
        response.json(res.data.results)
      })
      .catch((error) => {
        console.error(error.response);
        response.status(500).send(error).end();
      })
  })

  .get("/create_invitation", async (req, response) => {
    var data = " ";
    var config = {
      method: "post",
      url: `${ADMIN_URL}/connections/create-invitation?multi_use=true`,
      headers: {},
      data: data,
    };
    axios(config)
      .then(function (res) {
        console.log("create_invitation - respose received");
        //console.log(res)
        //var invitation = res.data.invitation;
        //console.log(`invitation ${invitation.serviceEndpoint}`)
        var inv = JSON.parse(res.data.invitation)
        console.log(`invitation ${inv}`)
        //inv.serviceEndpoint = "http://192.168.65.3:8060"
        invitation = JSON.stringify(inv)
        var config = { repo: REPO_DID, invitation};
  
        //console.log(config)
        response.json(config);
      })
      .catch((error) => {
        console.error(error.response);
        response.status(500).send(error).end();
      });
  })

  export default controllerRoutes ;