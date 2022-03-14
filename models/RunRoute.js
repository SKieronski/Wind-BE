const mongoose = require('mongoose')

//values we need
// userId, title, distance, startPos, endPos
const runRouteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        default: ''
    },
    distance: {
        type: String,
    },
    startPos: {
        latitude: Number,
        longitude: Number
    },
    endPos: {
        latitude: Number,
        longitude: Number
    }
})

mongoose.model('RunRoute', runRouteSchema);