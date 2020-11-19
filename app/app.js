import agent from './agent.js'
import express from 'express'
import axios from 'axios'

const app = express()
const port = process.env.PORT || 3000

app.get('/register', (request, response) => {
  let data = {"alias": 'Repo.Agent', "seed": "my_seed_00000000000000000000" + getRandomInt(9999), "role": "TRUST_ANCHOR"};
  axios
  .post(`${LEDGER_URL}/register`, data)
  .then(res => {
    console.log(res);
    response.json(res.data);

  })
  .catch(error => {
    console.error(error.response);
    response.status(500).send(error).end();
  })
});

app.get('/health_check', (req, res) => {
  res.send("up");
});

//
// schema fix
//
app.post("/schema_definition", (request, response) => {
  console.log('schemas')
  var data = {
    schema_name: "vsw schema",
    schema_version: "0.2",
    attributes: ["name", "url", "digest", "timestamp"],
  };
  var config = {
    method: "post",
    url: `${REPO_AGENT}/schemas`,
    headers: {},
    data: data,
  };
  axios(config)
    .then(function (res) {
      console.log("respose received");
      console.log(res);
      var schema_id = res.data.schema_id;
      console.log(res.data);
      response.json(res.data);
    })
    .catch((error) => {
      console.error(error.response);
      response.status(500).send(error).end();
    });
});

(async () => {
  await agent.start_agent();
})();

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});


