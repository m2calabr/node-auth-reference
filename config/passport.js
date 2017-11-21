const securePassword = require('secure-password');
module.exports = {
  'secret':'12345',
  'header':'authorization',
  'securePassword' : {
    'memlimit': securePassword.MEMLIMIT_DEFAULT,
    'opslimit': securePassword.OPSLIMIT_DEFAULT
  },
  'max_login_attempts': 5,
  'token_valid_for' : 60*60,
  'lock_time' : 2 * 60 * 60 * 1000
};
