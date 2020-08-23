const mongoose = require('mongoose')
const {Schema} = mongoose

const schoolAdminSchema = new Schema({
    schoolName: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    passwordConf: {
        type: String,
        required: true 
    },
    date: {
        type: Date,
        default: Date.now
    },
    userType:{
        type:String,
        default:'admin'
    }
})

const School = mongoose.model('school', schoolAdminSchema)
module.exports = School
