const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        require: true
    },
    lastName: {
        type: String,
        require: true
    },
    displayName: {
        type: String,
        require: true,
        unique: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    hashPassword: {
        type: String
    },
    country: {
        type: String,
        require: true
    },
    tel: {
        type: Number,
        unique: true,
        require: true
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Posts'
    }]
},
{
    timestamps: true
});

module.exports = mongoose.model('users', UserSchema);