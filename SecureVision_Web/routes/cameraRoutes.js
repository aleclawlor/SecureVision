let express = require('express')
let router = express.Router()

let cameraModel = require('../models/cameraModel')


//route for getting registered cameras 
router.get('/getCameras', (req, res, done) => {
  cameraModel.find({}, (err, foundData) => {

    console.log("looking for cameras...")

    if(err){
      console.log(err)
    }

    else{
      let responseObj = foundData
      console.log("Camera Data Found!")
      res.send(responseObj)
      return done(null, false, {data: responseObj})
    }
  })
})

// route for registering/adding a new camera 
router.post('/registerCamera', (req, res) => {

  // TODO: get video width and height, add it to object

  const newCamera = new cameraModel({
    source: req.body.source,
    name: req.body.name,
    port: req.body.port,
    schoolID: req.body.id,
    areaConfiguration: {
      x0: 0,
      y0: 0,
      x1: 400,
      y1: 400,
      width: 50,
      height: 50
    }
  })

  newCamera.save((err) => {
    if(err){
      console.log(err)
    }
    else{
      console.log("Camera successfully added to DB!")
    }
  })
})

router.put('/updateConfigurationArea', (req, res) => {

  let id = req.body.id 

  cameraModel.findOne({_id: id}, (err, found) => {

    if(err){
      console.log(err)
    } else {
      found.areaConfiguration.x0 = req.body.x0 
      found.areaConfiguration.y0 = req.body.y0 
      found.areaConfiguration.x1 = req.body.x1 
      found.areaConfiguration.y1 = req.body.y1 
      found.areaConfiguration.width = req.body.width 
      found.areaConfiguration.height = req.body.height 
    }

    found.save((err, updated) => {
      if(err){
        console.log(err)
      } else {
        console.log(updated)
        console.log('updated object saved to database')
        res.send(updated)
      }
    })

  })
})

router.put('/deactivateCamera', (req, res) => {

  let id = req.body.id 

  cameraModel.findOne({_id: id}, (err, foundObject) => {
    if(err){
      console.log(err)
    }
    else{
      foundObject.isActive = false 
      console.log("we made it")
    }
    foundObject.save((err, updatedObject) => {
      if(err){
        console.log(err)
      }
      else{
        console.log("Here")
        res.send(updatedObject)
      }
    })
  })
})

router.put('/editCamera', (req, res) => {
  let id = req.body.id 

  cameraModel.findOne({_id: id}, (err, foundObject) => {
    if(err){
      console.log(err)
    }
    else{
      if(!foundObject){
        console.log("Object does not exist")
      }
      else{
        foundObject.source = req.body.source,
        foundObject.name = req.body.name,
        foundObject.port = req.body.port 
      }
      foundObject.save((err, updatedObject) => {
        if(err){
          console.log(err)
        }
        else{
          res.send(updatedObject)
        }
      })
    }
  })
})

module.exports = router
