// db.js
var mongoose = require('mongoose');
var config = require('./config/database'); // get db config file
mongoose.connect(config.uri, {
  useMongoClient: true,
  /* other options */
});
