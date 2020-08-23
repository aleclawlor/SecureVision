let express = require('express')
let router = express.Router()

const unrecognizedModel = require('../models/unrecognizedModel')
const parentModel = require('../models/parentPlate')
const highRiskModel = require('../models/highRiskModel')
const feedModel = require('../models/generalFeedModel')

router.get('/clearGeneralFeed', (req, res) => {
    feedModel.deleteMany({}, (res, err) => {
        if(err){
            console.log(err)
        }
        else{
            console.log('Delete route successful')
            console.log(res)
        }
    })
})

// router.get('/clearUnrecognizedFeed', (req, res) => {
//     unrecognizedModel.deleteMany({}, (res, err) => {
//         if(err){
//             console.log(err)
//         }
//         else{
//             console.log('Deleted unregistered feed plates')
//             console.log(res)
//         }
//     })
// })

// add an unrecognized plate to the database 
router.post('/addUnrecognized', (req, res) => {

    unrecognizedModel.findOne({plateNumber: req.body.plateNumber}, (err, found) => {
        if(err){console.log(err)}
        else{
            if(!found){
                const newUnrecognized = new unrecognizedModel({
                    plateNumber: req.body.plateNumber,
                    location: req.body.location
                })
            
                newUnrecognized.save((err) => {
                    if(err){
                        console.log(err)
                    }
                    else{
                        console.log("Unregistered plate successfully saved to database")
                    }
                })
            }
            else{ 
                found.entryNumber = found.entryNumber+1
                found.save((err, updated) => {
                    if(err){
                        console.log(err)
                    }
                    else{
                        console.log("Updated unregistered recognitions")
                    }
                })
            }
        }
    })
})

// gets all unrecognized plate data 
router.get('/getUnrecognizedData', (req, res, done) => {

    // const newTest = feedModel({
    //     plateNumber: '911119',
    //     name: 'Alec Lawlor',
    //     type: 'Parent',
    //     location: 'Parking Lot',
    //     time: '14:21:32',
    //     date: '6/04/20'
    // })

    console.log("looking for all plates")
    

    unrecognizedModel.find({}, (err, foundData) => {

        // const newParent = new feedModel({
        //     plateNumber: '911119',
        //     name: ''
        // })

        console.log("Checking for unrecognized plates")
        if(err){
            console.log(err)
        } else { 
            let responseObj = foundData
            console.log("Data found!")
            res.send(responseObj)
            return done 
        }
    })
})


router.get('/getGeneralData', (req, res, done) => {
    feedModel.find({}, (err, foundData) => {
        console.log("Checking for general feed data")
        if(err){
            console.log('error encountered in general feed route')
            console.log(err)
        } else {
            let responseObj = foundData
            console.log("Data found!")
            res.send(responseObj)
            return done
        }
    })
})


router.post('/crosscheck', (req, res, done) => {
    // create a new plate object
    plateObject = {
        plateNumber: req.body.plateNumber,
        location: req.body.location
    }
    
    let currentNumber = plateObject.plateNumber

    // cross check databases
    parentModel.findOne({plateNumber: currentNumber}, (err, found) => {
        if(err){
            console.log(err) 
        }
        else if(!found){
            console.log("Not a parent plate")
        }
        else{
            if(found.isActive){
                console.log("Is a parent plate")
                return res.json(found)
            }
            else{
                console.log("Not a parent plate")
            }
        }
    })
    
    highRiskModel.findOne({plateNumber: currentNumber}, (err, found) => {
        if(err){
            console.log(err) 
        }
        else if(!found){
            console.log("Not a high risk plate")
        }
        else{
            if(found.isActive){
                console.log("Is a high risk plate")
                return res.json(found)
            }
            else{
                console.log("Not a high risk plate")
            }
        }
    })
})

module.exports = router 