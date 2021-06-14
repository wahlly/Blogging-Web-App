const mongoose = require('mongoose')

const multipleFileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    },
    title: {
        type: String,
        required: true
    },
    files: [Object]
}, { timestamps: true })


module.exports = mongoose.model('multipleFiles', multipleFileSchema)