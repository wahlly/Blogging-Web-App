require('dotenv').config({})
const router = require('express').Router()
const passport = require('passport')
const GitHubStrategy = require('passport-github').Strategy;
const mongoose = require('mongoose')
const { UserSchema } = require('../models/userSchema')
const Users = mongoose.model('users', UserSchema)

passport.serializeUser((user, cb) => {
    cb(null, user.id)
})

passport.deserializeUser((id, cb) => {
    Users.findOne({ userId: id })
    .then((user) => {
        cb(null, user)
    })
   .catch((err) => {
       cb(err, null)
   })
})

passport.use(
    new GitHubStrategy(
        {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:7000/auth/github/callback"
        },
  function(accessToken, refreshToken, profile, cb) {
    Users.findOne({ userId: profile.id }, (err, user) => {
      if(err) throw new Error(err.message)
      if(!err && user !== null) {
          cb(null, user)
      }
      else{
          Users.create({
              userId: profile.id,
              displayName: profile.username,
              email: profile.email,
              country: profile.location
          })
          .then((profile) => {
            cb(null, profile)
          })
          .catch((err) => {
              cb(err, null)
          })
      }
    }); 
  }
));


router.get('/login', (req, res) => {
    console.log(req.user)
    res.send('Simple chill Blog2')
})

//auth
router.get('/github', passport.authenticate('github'));

router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/auth/login');
  });

router.get('/logout', (req, res) => {
    req.logOut()
})


module.exports = router;