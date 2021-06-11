var express = require('express');
var router = express.Router();
const fs = require('fs');
const logger = require('../logger');

const DEFAULT_EXTERNAL_HOST = `${process.env.EXTERNAL_HOST}` || `${process.env.DOCKERHOST}`;


/* GET home page. 
router.get('/', function(req, res, next) {
  res.render('index', { title: 'VSW REPO' });
});
*/
router.get('/', function(req, res, next) {
  let readmePath =  __basedir + '/readme/INTRO.html'
  if (DEFAULT_EXTERNAL_HOST === "127.0.0.1")
    readmePath =  __basedir + '/readme/INTRO_local.html'
  console.log(DEFAULT_EXTERNAL_HOST)
  res.sendFile(readmePath);
});

module.exports = router;
