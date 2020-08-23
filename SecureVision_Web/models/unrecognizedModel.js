const mongoose = require('mongoose')
const {Schema} = require('mongoose')

let today = new Date()

const unrecognizedPlateSchema = new Schema({

    plateNumber: {
        type: String,
        required: true
    },
    date: {
        type: String,
        default: today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate() 
    },
    location: {
        type: String,
        required: true 
    },
    time: {
        type: String,
        default: today.getHours() + ":" + today.getMinutes()
    },
    entryNumber: {
        type: Number,
        default: 1
    },
    schoolID: {
        type: Number,
        required: true 
    }
})

const plate = mongoose.model('unrecognizedPlate', unrecognizedPlateSchema)
module.exports = plate 