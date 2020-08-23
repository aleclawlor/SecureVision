const mongoose = require('mongoose')
const {Schema} = mongoose

let today = new Date()

const parentCriminalSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    plateNumber: {
        type: String,
        required: true
    },
    date: {
        type: String,
        default: today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate() 
    },
    type: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true 
    },
    time: {
        type: String,
        default: today.getHours() + ":" + today.getMinutes()
    },
    schoolID: {
        type: String,
        required: true 
    }
})

const Feed = mongoose.model('generalfeed', parentCriminalSchema)
module.exports = Feed