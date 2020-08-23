const mongoose = require('mongoose')
const {Schema} = mongoose

const contactSchema = new Schema({
    number: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true  
    },
    schoolID: {
        type: String,
        required: true 
    }
})

const Contact = mongoose.model('contact', contactSchema)
module.exports = Contact