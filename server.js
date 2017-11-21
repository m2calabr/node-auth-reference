// server.js
const app = require('./app');
const api = require('./config/api');
const port = process.env.PORT || api.port;

var server = app.listen(port, () => {
  console.log('Express server listening on port ' + port);
});
