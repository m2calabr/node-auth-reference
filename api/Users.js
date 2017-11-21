//API for Users
const express = require('express');
const auth = require('../jwt')();
const {ObjectId} = require('mongodb');

const router = express.Router();

//We expect JASON
var bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
router.use(jsonParser);

var User = require('../Models/User');
//router.use(auth.authenticate());

// CREATES
router.post('/', function (req, res) {
    User.create({
            email : req.body.email,
            password : req.body.password
        },
        function (err, user) {
            if (err) return res.status(500).send("There was a problem adding the information to the database.");
            res.status(200).send(user);
        });
});

// READ ALL THE USERS IN THE DATABASE
//auth.authenticate()
//router.get('/', passport.authenticate('jwt', { session: true }), function (req, res) {
router.get('/', function (req, res) {
//router.get('/',  function (req, res) {
    console.log(req.headers);
    User.find({}, 'email password', function (err, users) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send(users);
    });
});

// READ A SINGLE USER FROM THE DATABASE
router.get('/:id', function (req, res) {
    var  userMongoID = ObjectId.isValid(req.params.id) ? new ObjectId(req.params.id) : null;
    User.findById(userMongoID, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        res.status(200).send(user);
    });
});

// UPDATES A SINGLE USER IN THE DATABASE
router.put('/:id', function (req, res) {

    User.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, user) {
        if (err) return res.status(500).send("There was a problem updating the user.");
        res.status(200).send(user);
    });
});

// DELETES A USER FROM THE DATABASE
router.delete('/:id', function (req, res) {
    User.findByIdAndRemove(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem deleting the user.");
        res.status(200).send("User "+ user.email +" was deleted.");
    });
});


module.exports = router;
