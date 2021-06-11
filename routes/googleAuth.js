require('dotenv').config()
const router = require('express').Router()
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
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

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:7000/auth/google/callback"
  },
  async(accessToken, refreshToken, profile, cb) => {
      console.log(profile)
    const newUser = {
        userId: profile.id,
        email: profile.emails[0].value,
        displayName: profile.displayName,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        image: profile.photos[0].value
     }
     try {
         let user = await Users.findOne({ userId: profile.id })
         if(user) {
            cb(null, user)
         }
         else{
            user = await Users.create(newUser)
            cb(null, user)
         }
     }
     catch(err) {
         cb(err, null)
     }
  }
));

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/auth/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/auth/dashboard');
  });


router.get('/login', (req, res) => {
    res.send('Kindly login with your google')
})


router.get('/dashboard', (req, res) => {
    res.send('Welcome to our Humble Blog')
})

module.exports = router