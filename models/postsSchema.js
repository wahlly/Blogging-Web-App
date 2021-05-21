const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    content: {
        type: String,
        require: true
    }
},
{
    timestamps: true
});

module.exports = mongoose.model('Posts', PostSchema);