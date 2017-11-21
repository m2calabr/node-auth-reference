// app.js
var api = require('./config/api');

const auth = require('./jwt')();
const bodyParser = require('body-parser');
const express = require('express');
const db = require('./db');

const app = express();

//setup middleware
const jsonParser = bodyParser.json();
app.use(jsonParser); // Set default parsing application/json for the body
app.use(auth.initialize());

var UserController = require('./api/Users');
app.use('/users', UserController);

var AuthController = require('./api/Auth');
app.use('/auth', AuthController);

app.get("/", function(req, res) {
  res.json({message: "THunt API ", version: api.version});
});

module.exports = app;
