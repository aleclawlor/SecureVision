let express = require('express')
let router = express.Router()

const passport = require('passport')
const localStrategy = require('passport-local').Strategy

let User = require('../models/user')

// endpoint to log in  
router.post('/authcheck', function(req,res,next){

    passport.authenticate('local', function(err, user, info) {
    console.log(user)
        if (err) { return res.json(info); }
        if (!user) {
        console.log('User not found in DB') 
        return res.json(info); 
    }
        else{
            console.log('User found!', user)
            console.log(info)
            info.user = user
            return res.json(info)
        }
     })(req, res, next);   
})

// endpoint to get current user
router.get('/user', (req, res) => {
    res.send(req.user)
})

// endpoint to logout
router.get('/logout', (req, res, next) => {
    // if there is a session, delete it
    if(req.session){
        req.session.destroy((err) => {
            if(err){
                return next(err)
            }
            else{
                return res.redirect('/')
            }
        })
    }
})

module.exports = router