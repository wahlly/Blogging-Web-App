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

    /**
     * @desc get a user's info or profile using its displayName
     * @param {user's displayName} displayName 
     * @returns either the user's profile if found or null if otherwise
     */
    static async retrieveUserByDisplayName(displayName) {
        try {
        return await Users.findOne({displayName: displayName},
            {
                tel: true,
                displayName: true,
                email: true,
                firstName: true,
                lastName: true,
                createdAt: true
            })
        }
        catch (error) {
            console.log(error)
        }
    }

    static async editUserProfile(displayName, email, country, tel, paramsId) {
        return Users.findOneAndUpdate({_id: paramsId},
            {
            'displayName': displayName,
            'email': email,
            'country': country,
            'tel': tel
        },
        {
            new: true,
            runValidators: true
        }
        )
    }

    
}