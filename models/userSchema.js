const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

exports.UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    displayName: {
        type: String,
        required: true,
        unique: [true, 'displayName already taken, try something else']
    },
    email: {
        type: String,
        unique: [true, 'email has been used by another user'],
        required: [true, 'please input your email'],
        trim: true
    },
    hashPassword: {
        type: String
    },
    country: {
        type: String,
        // required: [true, 'please, fill in your country!']
    },
    tel: {
        type: Number,
        unique: [true, 'number has already been used!'],
    }
},
{
    timestamps: true
});

exports.UserSchema.methods.comparePassword = (password, hashPassword) => {
    return bcrypt.compareSync(password, hashPassword)
}