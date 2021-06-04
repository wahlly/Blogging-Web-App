const mongoose = require('mongoose')
const { UserSchema } = require('../models/userSchema')
const Users = mongoose.model('users', UserSchema)
const bcrypt = require('bcrypt')
const saltRound = 10

module.exports = class UserServices{
    static async userRegistration(userProfile) {
        const newUser = new Users(userProfile)
        const salt = bcrypt.genSaltSync(saltRound)
        newUser.hashPassword = bcrypt.hashSync(userProfile.password, salt)

        return newUser.save()
    }

    /**
     * @param {users email} usersMail
     * @desc checks for the given mail in the database to see if it exists
     * @returns the mail if it exists and null if it doesn't 
     */
    static async credentialsValidation(usersMail) {
        try {
            return await Users.findOne({email: usersMail})
        }
        catch(err) {
            console.error(err)
        }
    }

    static async retrieveUserByDisplayName(paramsId) {
        try {
            return Users.findById(paramsId)
        }
        catch (error) {
            console.log(error)
        }
    }

    static async editUserProfile(displayName, email, password, country, tel, paramsId) {
        return Users.updateOne({
            'displayName': displayName,
            'email': email,
            'password': password,
            'country': country,
            'tel': tel
        },
        {
            where: {
                _id: paramsId
            }
        })
    }

    
}