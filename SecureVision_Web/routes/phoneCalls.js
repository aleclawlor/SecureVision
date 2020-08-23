let express = require('express')
let router = express.Router()

// const keys = require('../config/keys');

// const accountSid = keys.twilioSid
// const authToken = keys.twilioAuthToken

// const client = require('twilio')(accountSid, authToken)

router.get('/dummyCall', (req, res) => {
    console.log(req)
})

// router.post('/makeCall', (req, res) => {

//     const outboundNumber = '+1' + req.body.number 

//     client.calls.create({
//         url: 'https://demo.twilio.com/docs/voice.xml',
//         to: outboundNumber,
//         from: '+12058434346'
//     }, (err, call) => {
//         if(err){
//             console.log(err)
//         }
//         else{
//             console.log(call.sid)
//         }
//     })

// })

module.exports = router 