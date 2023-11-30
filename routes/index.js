var express = require('express');
var router = express.Router();
const userModel = require('../models/userModel.js');
const postModel = require('../models/postModel.js');
const passport = require("passport");
const LocalStrategy = require("passport-local");
passport.use(new LocalStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function(req, res) {
  res.render('Authentigate/signup.ejs');
});

module.exports = router;
