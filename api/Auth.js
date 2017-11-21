// Auth.js
const express = require('express');
const router = express.Router();
const auth = require('../jwt')();
const User = require('../Models/User');

router.post('/signup', function(req, res) {
  if (req.body.email && req.body.password) {
    User.create({
          email : req.body.email,
          password : req.body.password
      },
      function (err, user) {
          if (err) return res.status(500).send("Bad request.");
          res.status(200).send(user);
    });
  } else {
    res.status(400).json({success: false, msg: 'Please pass email and password.'});
  }
});

router.post('/signin', function(req, res) {
  User.findOne({email: req.body.email}, function (err, user) {
    if (err) return res.status(401).send('Authentication failed.');

    if (user) {
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          const token = user.getToken();

          // return the information including token as JSON
          return res.status(200).json({token: 'JWT ' + token});
        } else {
          return res.status(401).send('Authentication failed.');
        }
      });
    } else {
      //no user found
      return res.status(401).send('Authentication failed.');
    }
  });


});
//auth.authenticate(),
router.post('/validateToken', auth.authenticate(), function(req, res) {
  return res.status(200).json({'token':'valid'});
});

module.exports = router;
