const mongoose = require('mongoose')
const {Schema} = mongoose

const highRiskSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    type: {
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

const highRisk = mongoose.model('highRiskPlate', highRiskSchema)
module.exports = highRisk