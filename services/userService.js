const mongoose = require('mongoose')
const { UserSchema } = require('../models/userSchema')
const Users = mongoose.model('users', UserSchema)
const Token = require('../models/token')
const Validations = require('../validators/validator')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const saltRound = 10
const sendEmail = require('../utils/email/sendEmail')

module.exports = class UserServices{
    /**
     * @desc registers a new user into the database
     * @param {Object} userProfile 
     * @returns {Promise<user>}
     */
    static async userRegistration(userProfile) {
        try{
            let { error, isValid } = await Validations.newUser(userProfile)
            if(!isValid) {
                return error
            }
            const newUser = new Users(userProfile)
            const salt = bcrypt.genSaltSync(saltRound)
            newUser.hashPassword = bcrypt.hashSync(userProfile.password, salt)
            return newUser.save()
        }
        catch(err) {
            console.error(err)
        }
    }

    /**
     * @desc checks for the given mail in the database to see if the user pre-exists
     * @param {email} usersMail
     * @returns {Promise<the mail if it exists and null if it doesn't>}
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
     *@desc generates a token to confirm that it's the user that requested for password reset
     * @param {email} usersMail 
     * @returns {Promise<a token in which will be sent to the user's mail also with a redirection link to fasten password reset>}
     */
    static async resetPasswordRequest(usersMail) {
        try{
            //check if user exists
            const user = await Users.findOne({ email: usersMail })
            //check if user has an existing token if true, delete token
            let token = await Token.findOne({userId: user._id})
            if(token) {
                await Token.findByIdAndDelete(token._id)
            }

            let resetToken = await crypto.randomBytes(32).toString('hex')
            const hash = await bcrypt.hash(resetToken, 10)
            await new Token({
                userId: user._id,
                token: hash,
                createdAt: Date.now()
            }).save()

            const link = `localhost:7000/passwordReset?token=${resetToken}&id=${user._id}`;
            await sendEmail(user.email,"Password Reset Request",{name: user.displayName, link}, '../template/reqResetPwd.handlebars')
            return resetToken
        }
        catch(err){
            console.error(err)
        }
    }

    /**
     * @desc confirms if the token is same as the one generated, then takes the new password, hash and then store it as the user's password. it then deletes the used token.
     * @param {Number} userId 
     * @param {String} token
     * @param {String} password 
     * @returns {Promise<the user's acct with the password updated with the new password>}
     */
    static async resetPassword(userId, token, password) {
        try{
            let PasswordResetToken = await Token.findOne({ userId: userId })
            await bcrypt.compare(token, PasswordResetToken.token)
            const hash = await bcrypt.hash(password, 10)
            await Users.findOneAndUpdate({_id: userId}, {$set: {hashPassword: hash}}, {new: true, runValidators: true})

            const user = await Users.findById(userId)
            await sendEmail(
                user.email,
                'Password Reset Successfully',
                { name: user.displayName },
                '../template/resetPwd.handlebars'
                )
            await PasswordResetToken.deleteOne()
            return user
        }
        catch(err) {
          console.error(err)
        }
    }

    /**
     * @desc get a user's info or profile using its displayName
     * @param {String} displayName 
     * @returns {Promise<either the user's profile if found or null if otherwise>}
     */
    static async retrieveUserByDisplayName(displayName) {
        try {
        return await Users.findOne({displayName: displayName},
            {
                tel: true,
                country: true,
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

    /**
     * @desc finds a user with the given id and update whats given into his profile.
     * @param {Number} userId
     * @param {Object} req.body 
     * @returns {Promise<the updated user's profile if found>}
     */
    static async editUserProfile(userId, displayName, email, country, tel) {
        try{
            return await Users.findOneAndUpdate({_id: userId},
                {
                displayName: displayName,
                email: email,
                country: country,
                tel: tel
            },
            {
                new: true,
                runValidators: true
            }
            )
        }
        catch(err) {
            console.error(err)
        }
    }

    /**
     * @desc finds a user by id and deletes the user from the database
     * @param {Number} userId 
     * @returns {Promise}
     */
    static async removeUser(userId) {
        try {
            return await Users.findByIdAndDelete(userId)
        }
        catch(err) {
            console.error(err)
        }
    }
}