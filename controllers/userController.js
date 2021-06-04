const UserServices = require('../services/userService')
const jwt = require('jsonwebtoken')

module.exports = class UserController{
    /**
     * @route PoST 
     * @param {user profile} req
     * @returns the user's newly created profile
     */
    static async createNewUser(req, res) {

        try {
            let newUser = await UserServices.userRegistration(req.body)
            newUser.hashPassword = undefined

            return res.status(200).json({
                status: 'success',
                profile: newUser
            })
        } 
        catch (err) {
            console.error(err)
            return res.status(500).json({
                status: 'failed',
                msg: 'server error'
            })
        }

    }

    /**
     * @route PoST 
     * @param {login details} req 
     * @returns a session token if user is valid
     */
    static async checkUsersLogin(req, res) {
        try {
            const { email, password } = req.body
            let user = await UserServices.credentialsValidation(email)
            if(!user) {
                return res.status(401).json({
                    status: 'failed',
                    msg: 'User not found, Register to become a user!'
                })
            }
            if(!user.comparePassword(password, user.hashPassword)) {
                return res.status(401).json({
                    status: 'failed',
                    msg: 'oops, wrong password! try again'
                })
            }

            return res.status(200).json({
                status: 'success',
                token: jwt.sign({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    displayName: user.displayName,
                    email: user.email,
                    role: user.role,
                    country: user.country,
                    tel: user.tel,
                    _id: user.id
                }, 'blog')
            })
        }
        catch(err) {
            console.error(err)
            return res.status(500).json({
                status: 'failed',
                msg: 'server error'
            })
        }
    }

    static async getUserByDisplayName(req, res) {

        try {
            console.log('i got here 22')
            let user = await UserServices.retrieveUserByDisplayName(req.params.id)
            return res.status(200).json({
                status: 'success',
                profile: user
            })
        } 
        catch (error) {
            console.log(error)
            return res.status(500).json({
                status: 'failed',
                error
            })
        }

    }

    static async updateUserProfile(req, res) {

        try {
            let user = await UserServices.editUserProfile(req.body.displayName, req.body.email, req.body.password, req.body.country, req.body.tel, req.params._Id)
            return res.status(200).json({
                status: 'success',
                profile: user
            })
        }
        catch (error) {
            return res.status(500).json({
                status: 'failed',
                error
            })
        }

    }


}