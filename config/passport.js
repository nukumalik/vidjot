const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')

// Load models
const User = require('../models/User')

module.exports = passport => {
  passport.use(
    new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
      // let errors = [];
      User.findOne({email}).then(user => {
        if (!user) {
          return done(null, false, {
            message: 'Email not registered yet'
          })
        }
        bcrypt.compare(password, user.password).then(isMatch => {
          if (isMatch) {
            return done(null, user)
          } else {
            return done(null, false, {
              message: 'Password incorrect'
            })
          }
        })
      })
    })
  )
  passport.serializeUser(function (user, done) {
    done(null, user.id)
  })

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user)
    })
  })
}

// const { email, password } = req.body;
