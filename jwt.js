//This sets up the passport to use Java Web Tokens
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const {ObjectId} = require('mongodb');

// load up the user model
var User = require('./Models/User'); //needed to check the user id in the token
var config = require('./config/passport');

var passportSetup = {};
passportSetup.initialize = function() {
  //JWT options
  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromHeader(config.header);
  opts.secretOrKey = config.secret;
  opts.ignoreExpiration = true;

  var strategy = new JwtStrategy(opts, function(jwt_payload, done) {
    var  userMongoID = ObjectId.isValid(jwt_payload.id) ? new ObjectId(jwt_payload.id) : null;
    //check to see if we have a valid token
    User.findOne({_id: userMongoID}, function(err, user) {
        //db error
        if (err) { return done(err, false); }
        //The token contains a valid user
        if (user) { return done(null, user); }
        //otherwise it is a bad token
        return done(null, false);
      });
  });

  passport.use(strategy);
  return passport.initialize();
};

passportSetup.authenticate = function() {
   return passport.authenticate("jwt", { session: false }); //no session as this is for an API not web pages
};

passportSetup.checkScopes = function(scopes) {
  return function(req, res, next) {
    //
    // check if any of the scopes defined in the token,
    // is one of the scopes declared on check_scopes
    //
    var token = req.token_payload;
    console.log(token);
    for (var i =0; i<token.scopes.length; i++){
      for (var j=0; j<scopes.length; j++){
          if(scopes[j] === token.scopes[i]) return next();
      }
    }

    return res.send(401, 'insufficient scopes')
  }

};



module.exports = function() {

  return {
      initialize: function() {
          return passportSetup.initialize();
      },
      authenticate: function() {
          return passportSetup.authenticate();
      },
      checkScopes: function(scopes) {
          return passportSetup.checkScopes(scopes);
      }
  };
};
