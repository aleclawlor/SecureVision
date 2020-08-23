let express = require('express')
let router = express.Router()

let SchoolRegisterModel = require('../models/school')
let PlateRegisterModel = require('../models/parentPlate')
let HighRiskModel = require('../models/highRiskModel')

router.use(express.urlencoded({extended: false}))

router.post('/register', (req, res) => {

    console.log(req.body)
    
    const newSchool = new SchoolRegisterModel({
        schoolName: req.body.schoolName,
        email: req.body.email,
        city: req.body.city,
        state: req.body.state,
        password: req.body.password,
        passwordConf: req.body.confirmPassword
    })
    newSchool.save((err) => {
        if(err){
            console.log(err)
        }
        else{
            res.redirect('/')
        }
    })
})

router.post('/plateRegistration', (req, res) => {
    console.log(req.body)

    const newPlate = new PlateRegisterModel({
        parentName: req.body.parentName,
        studentName: req.body.studentName,
        plateNumber: req.body.plateNumber,
        isActive: true,
        schoolID: req.body.id 
    })
    newPlate.save()
})

router.post('/highRiskRegistration', (req, res) => {
    const newHighRisk = new HighRiskModel({
        name: req.body.name,
        type: req.body.type,
        plateNumber: req.body.plateNumber,
        isActive: true,
        schoolID: req.body.id
    })
    newHighRisk.save()
})


module.exports = router