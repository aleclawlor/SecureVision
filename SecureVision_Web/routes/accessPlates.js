let express = require('express')
let router = express.Router()

let plateModels = require('../models/parentPlate')
let highRisk = require('../models/highRiskModel')

router.get('/getPlates', (req, res, done) => {
  plateModels.find({}, (err, foundData) => {
      if(err){
          console.log(err)
      }
      else{
        let responseObj = foundData
        res.send(responseObj)
        return done(null, false, {data: responseObj})
      }
  })
})

router.get('/getHighRisk', (req, res, done) => {
  highRisk.find({}, (err, foundData) => {
    console.log("Looking for high risk plates...")
    if(err){
      console.log(err)
    }
    else{
      let responseObj = foundData
      res.send(responseObj)
      return done(null, false, {data: responseObj})
    }
  })
})

module.exports = router 