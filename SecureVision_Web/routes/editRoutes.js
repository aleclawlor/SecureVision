let express = require('express')
let router = express.Router()

let plateCollection = require('../models/parentPlate')
let highRiskCollection = require('../models/highRiskModel')

// edit general info for the plate
router.put('/editPlate', (req, res) => {
    let id = req.body.id

    plateCollection.findOne({_id: id}, (err, foundObject) => {
        if(err){
            console.log(err)
        }
        else{
            if(!foundObject){
                console.log("Object does not exist")
            }
            else{
                foundObject.parentName = req.body.parentName
                foundObject.studentName = req.body.studentName 
                foundObject.plateNumber = req.body.plateNumber
            }
            foundObject.save((err, updatedObject) => {
                if(err){
                    console.log(err)
                }
                else{
                    console.log("Here!")
                    res.send(updatedObject)
                }
            })
        }
    })
})

// deactivate a plate
router.put('/deactivate', (req, res) => {
    let id = req.body.id

    plateCollection.findOne({_id: id}, (err, foundObject) => {
        if(err){
            console.log(err)
        }
        else{
            if(!foundObject){
                console.log("Object does not exist")
            }
            else{
                foundObject.isActive = false;
                console.log("We made it")
            }
            foundObject.save((err, updatedObject) => {
                if(err){
                    console.log(err)
                }
                else{
                    console.log("Here!")
                    res.send(updatedObject)
                }
            })
        }
    })
})

// edit a high risk plate 
router.put('/editHighRisk', (req, res) => {
    let id = req.body.id

    highRiskCollection.findOne({_id: id}, (err, foundObject) => {
        if(err){
            console.log(err)
        }
        else{
            if(!foundObject){
                console.log("Object does not exist")
            }
            else{
                foundObject.name = req.body.name
                foundObject.type = req.body.type
                foundObject.plateNumber = req.body.plateNumber
            }
            foundObject.save((err, updatedObject) => {
                if(err){
                    console.log(err)
                }
                else{
                    console.log("Here!")
                    res.send(updatedObject)
                }
            })
        }
    })
})

// deactivate a high risk plate
router.put('/deactivateHighRisk', (req, res) => {
    
    let id = req.body.id

    highRiskCollection.findOne({_id: id}, (err, foundObject) => {
        if(err){
            console.log(err)
        }
        else{
            if(!foundObject){
                console.log("Object does not exist")
            }
            else{
                foundObject.isActive = false;
                console.log("We made it")
            }
            foundObject.save((err, updatedObject) => {
                if(err){
                    console.log(err)
                }
                else{
                    console.log("Here!")
                    res.send(updatedObject)
                }
            })
        }
    })
})

module.exports = router