let express = require('express')
let router = express.Router()

let unregisteredModel = require('../models/unrecognizedModel')

router.post('/addUnrecognized', (req, res) => {

    const newUnregistered = new unregisteredModel({
        plateNumber: req.body.plateNumber
    })
    newUnregistered.save((err) => {
        if(err){
            console.log(err)
        }
        else{
            console.log("New unregisted plate successfully added to DB")
        }
    })
        
})

module.exports = router 