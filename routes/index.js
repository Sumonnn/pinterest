var express = require('express');
var router = express.Router();
const isLoggedIn = require('../routes/isLoggedin.js')
const userModel = require('../models/userModel.js');
const postModel = require('../models/postModel.js');
const passport = require("passport");
const upload = require('./multer.js');

const LocalStrategy = require("passport-local");
passport.use(new LocalStrategy(userModel.authenticate()));

//multer code
router.post('/upload', isLoggedIn, upload.single('file'), async function (req, res) {
  if (!req.file) {
    return res.status(400).send('No files were given.');
  }
  const user = await userModel.findOne({ username: req.session.passport.user });
  const postData = await postModel.create({
    image: req.file.filename,
    postText: req.body.postText,
    user: user._id,
  })
  user.posts.push(postData._id);
  await user.save();
  res.redirect('/profile');
});

/* GET home page. */
router.get('/', function (req, res) {
  res.render('Authentigate/signup.ejs');
});
router.get('/signin', function (req, res) {
  res.render('Authentigate/signin.ejs', { err: req.flash('error') });
});
router.get('/feed', (req, res) => {
  // res.render('Pinterest/feed.ejs');
})
router.get('/profile', isLoggedIn, async function (req, res) {
  try {
    const user = await userModel.findOne({
      username: req.session.passport.user,
    }).populate('posts');
    res.render('Pinterest/profile.ejs', {
      user: user,
    });
  } catch (error) {
    res.send(error);
  }
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
    failureFlash: true,
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
