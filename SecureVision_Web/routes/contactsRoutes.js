let express = require('express')
let router = express.Router()

let contactModel = require('../models/contactModel')

router.get('/getContacts', (req, res, done) => {
    contactModel.find({}, (err, foundData) => {
        console.log("Looking for contacts...")
        if(err){
            console.log(err)
        }
        else{
            let responseObj = foundData
            console.log("Contacts data found!")
            res.send(responseObj)
            return done(null, false, {data: responseObj})
        }
    })
})

router.post('/addContacts', (req, res) => {

    const newContact = new contactModel({
        number: req.body.number,
        name: req.body.name,
        schoolID: req.body.id 
    })

    newContact.save((err) => {
        if(err){
            console.log(err)
        }
        else{
            console.log("Contact successfully added to DB!")
        }
    })
})

router.put('/deactivateContact', (req, res) => {

    let id = req.body.id

    contactModel.findOne({_id: id}, (err, foundObject) => {
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

router.put('/editContact', (req, res) => {
    let id = req.body.id

    contactModel.findOne({_id: id}, (err, foundObject) => {
        if(err){
            console.log(err)
        }
        else{
            if(!foundObject){
                console.log("Object does not exist")
            }
            else{
                foundObject.name = req.body.name
                foundObject.number = req.body.number
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