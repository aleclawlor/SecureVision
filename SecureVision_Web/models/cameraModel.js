const mongoose = require('mongoose')
const {Schema} = mongoose

const cameraSchema = new Schema({
    source: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    port: {
        type: String,
        required: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    schoolID: {
        type: String,
        required: true 
    },
    areaConfiguration: {
        type: Object,
        default: {}
    }
})

const Camera = mongoose.model('camera', cameraSchema)
module.exports = Camera