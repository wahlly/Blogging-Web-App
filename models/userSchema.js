const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

exports.UserSchema = new mongoose.Schema({
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
    }
},
{
    timestamps: true
});

exports.UserSchema.methods.comparePassword = (password, hashPassword) => {
    return bcrypt.compareSync(password, hashPassword)
}