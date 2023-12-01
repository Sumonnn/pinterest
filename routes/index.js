var express = require('express');
var router = express.Router();
const isLoggedIn = require('../routes/isLoggedin.js')
const userModel = require('../models/userModel.js');
const postModel = require('../models/postModel.js');
const passport = require("passport");
const LocalStrategy = require("passport-local");
passport.use(new LocalStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function (req, res) {
  res.render('Authentigate/signup.ejs');
});
router.get('/signin', function (req, res) {
  res.render('Authentigate/signin.ejs');
});
router.get('/profile', isLoggedIn, function (req, res) {
  res.render('Pinterest/profile.ejs');
});


// SIGNUP CODE
router.post("/signup", async function (req, res, next) {
  try {
    const { username, email, fullname } = req.body;
    const userData = new userModel({ username, email, fullname });
    console.log(userData);
    await userModel.register(userData, req.body.password);
    res.redirect("/signin");
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

// SIGNIN CODE
router.post(
  "/signin",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/signin",
  }),
  function (req, res, next) { }
);


// SIGNOUT CODE
router.get("/signout", isLoggedIn, function (req, res, next) {
    req.logout(() => {
        res.redirect("/signin");
    });
});



module.exports = router;
