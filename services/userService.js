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
     *@desc generates a token to confirm that it's the user that requested for password reset
     * @param {user's email} usersMail 
     * @returns a token in which will be sent to the user's mail also with a redirection link to fasten password reset
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
     * @desc takes the new password, hash and then store it as the user's password. it then deletes the used token.
     * @param {user's id} paramsId 
     * @param {token sent to mail} token 
     * @param {new password to be used by the user} password 
     * @returns the user's acct with the password updated with the new password
     */
    static async resetPassword(paramsId, token, password) {
        try{
            let PasswordResetToken = await Token.findOne({ userId: paramsId })
            await bcrypt.compare(token, PasswordResetToken.token)
            const hash = await bcrypt.hash(password, 10)
            await Users.findOneAndUpdate({_id: paramsId}, {$set: {hashPassword: hash}}, {new: true, runValidators: true})

            const user = await Users.findById(paramsId)
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
     * @param {user's displayName} displayName 
     * @returns either the user's profile if found or null if otherwise
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
     * @param {user's id} paramsId
     * @param {editable profile} req.body 
     * @returns the updated user's profile if found
     */
    static async editUserProfile(paramsId, displayName, email, country, tel) {
        try{
            return await Users.findOneAndUpdate({_id: paramsId},
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

    static async removeUser(paramsId) {
        try {
            return await Users.findByIdAndDelete(paramsId)
        }
        catch(err) {
            console.error(err)
        }
    }
}