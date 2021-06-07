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
        unique: [true, 'displayName already taken, try something else']
    },
    email: {
        type: String,
        require: true,
        unique: [true, 'email has been used by another user']
    },
    hashPassword: {
        type: String
    },
    country: {
        type: String,
        required: [true, 'please, fill in your country!']
    },
    tel: {
        type: Number,
        unique: [true, 'number has already been used!'],
        required: [true, 'phone number is required!']
    }
},
{
    timestamps: true
});

exports.UserSchema.methods.comparePassword = (password, hashPassword) => {
    return bcrypt.compareSync(password, hashPassword)
}