const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

// const keys = (process.env.NODE_ENV === 'production') ?  null : require('../config/keys')
let User = require('../models/school')

passport.serializeUser(function(user, done) {
    console.log('serialize')
    done(null, user);
  });
  
  passport.deserializeUser(function(id, done) {
    console.log('deserialize')

    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use('local', new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        function(email, password, done) {
         
    User.findOne({email:email.toLowerCase()}, function(err,user){
               // if there's an error, finish trying to authenticate (auth failed)
              if (err) { 
                  console.log(err, 'admin');
                  return done(err);
              }
              // if no user present, auth failed
              if (!user) {
                  console.log(user, ' !user admin');
                  return done(null, false, { message: 'user not present' });
              }
              // if passwords do not match, auth failed
              if (user.password !== password) {
                  return done(null, false, { message: 'incorrect password' });
              }
              // auth has has succeeded
              return done(null, user, {message: 'success'});
          });
        }
    ))

