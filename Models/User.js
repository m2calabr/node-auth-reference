// User.js
const mongoose = require('mongoose');
const securePassword = require('secure-password')
const jwt = require('jsonwebtoken');
const passportConfig = require('../config/passport');
const pwd = securePassword({
  memlimit: passportConfig.memlimit,
  opslimit: passportConfig.opslimit
});

const MAX_LOGIN_ATTEMPTS = passportConfig.max_login_attempts;
const LOCK_TIME = passportConfig.lock_time;

var UserSchema = new mongoose.Schema({
  name: String,
  email: {
    type:String,
    required:true,
    index: { unique: true },
    lowercase: true,
    trim: true
  },
  password: {
    type:String,
    required:true,
    min:8,
    max:64
  },
  loginAttempts: {
    type: Number,
    required: true,
    default: 0
  },
  lockUntil: {
    type: Number
  }
}, {
  runSettersOnQuery: true
});

UserSchema.virtual('isLocked').get(function() {
    // check for a future lockUntil timestamp
    return !!(this.lockUntil && this.lockUntil > Date.now());
});


UserSchema.pre('save', function(next) {
    const user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();
    const userPassword = Buffer.from(user.password);

    // Save the new password, this will use the lastest hash
    pwd.hash(userPassword, function (err, hash) {
      if (err) throw next(err);
      //save the hash
      user.password = hash;
      next();
    });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    const user = this;

    // Save hash somewhere
    const currentHash = Buffer.from(this.password);
    const enteredPassword = Buffer.from(candidatePassword);

    //Check to see if we have a valid hash size from the DB or otherwise
    //the verify will fail an assert and send a 500 back.
    if ( currentHash.length === securePassword.HASH_BYTES ){
      pwd.verify(enteredPassword, currentHash, function (err, result) {
        var valid=false;  //assume the password is BAD
        if (err) throw err;

        if (result === securePassword.INVALID_UNRECOGNIZED_HASH) {
          //bad hash -- passowrd is still consider BAD
          //May want to have the user to a password reset.
          //console.error('ERROR Bad password hash for: ' + user.email);
        }
        if (result === securePassword.INVALID) {
          //Bad password
          //console.log('ERROR: Invalid password for:' + user.email);
        }
        if (result === securePassword.VALID) {
          valid=true;
          //console.log('Login: ' + user.email);
        }
        if (result === securePassword.VALID_NEEDS_REHASH) {
          valid=true;
          //console.log('Updated to more secure hash: ' + user.email);
          //Update the use to a updated hash
          pwd.hash(userPassword, function (err, improvedHash) {
            if (err) {
              console.error('ERROR: User authenticated, but could not update hash');
            } else {
              //Save improvedHash back to the user
              user.update({ _id: user._id }, { $set: { password: improvedHash }});
            }
          })
        }
        cb(null, valid);
      });
    } else {
      //Bad DB hash
      cb(new Error("Bad database hash"),false);
    }

};


// expose enum on the model, and provide an internal convenience reference
const reasons = UserSchema.statics.failedLogin = {
    NOT_FOUND: 0,
    PASSWORD_INCORRECT: 1,
    MAX_ATTEMPTS: 2
};


exports.register = function(req, res){};
exports.sign_in = function(req, res){};
exports.loginRequired = function(req, res){};

UserSchema.statics.testHash = function(clearPassword){
  const passwordAsBuffer = Buffer.from(clearPassword);
  const passwordHashedAsBuffer = pwd.hashSync(passwordAsBuffer);
  const passwordCypher = Buffer.concat([passwordHashedAsBuffer]).toString('utf-8');
  return passwordCypher;
};

UserSchema.statics.generateToken = function(user){
  const payload = {
    id: user._id,
    exp: Math.floor(Date.now() / 1000) + passportConfig.token_valid_for,
    scopes : []
  };
  const token = jwt.sign(payload, passportConfig.secret);
  return token;
};

UserSchema.methods.getToken = function(){
  const user = this;
  return UserSchema.statics.generateToken(user);
};


mongoose.model('User', UserSchema);
module.exports = mongoose.model('User');
