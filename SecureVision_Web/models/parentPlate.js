const mongoose = require('mongoose')
const {Schema} = mongoose

const parentPlateSchema = new Schema({
    parentName: {
        type: String,
        required: true
    },
    studentName: {
        type: String,
        required: true  
    },
    plateNumber: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        required: true 
    },
    schoolID: {
        type: String,
        required: true 
    }
})

const parentPlate = mongoose.model('parentPlate', parentPlateSchema)
module.exports = parentPlate