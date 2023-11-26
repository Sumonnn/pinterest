var express = require('express');
var router = express.Router();
const userModel = require('../models/userModel.js');
const postModel = require('../models/postModel.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
