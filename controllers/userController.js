const UserServices = require('../services/userService')
const jwt = require('jsonwebtoken')

module.exports = class UserController{
    /**
     * @desc Creates a new user
     * @route PoST /auth/register
     * @returns {the user's newly created profile}
     */
    static async createNewUser(req, res) {
        try {
            let newUser = await UserServices.userRegistration(req.body)
            if(!newUser || newUser.msg) {
                return res.status(400).json({
                    status: 'failed',
                    error: newUser
                })
            }
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
                msg: err
            })
        }
    }

    /**
     * @desc confirms a pre-existing user before login
     * @route PoST /auth/login
     * @returns {a session token if user is valid}
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

    /**
     * @desc send a password reset token to the user's mail
     * @route PoST /auth/resetPassword
     * @returns {the confirmation token/sent to the user's mail}
     */
    static async requestPasswordChange(req, res) {
        try {
            let newToken = await UserServices.resetPasswordRequest(req.body.email)
            if(!newToken) {
                return res.status(404).json({
                    status: 'failed',
                    msg: 'User not found!'
                })
            }
            return res.status(200).json({
                status: 'success',
                token: newToken
            })
        }
        catch(err) {
            return res.status(500).json({
                status: 'failed',
                msg: 'server error' + err
                
            })
        }
    }

    /**
     * @desc changes the user's password after verifying the submitted token
     * @route PoST /auth/newPassword
     * @returns {user updated profile}
     */
    static async changePassword(req, res) {
        try {
            let newPasswordReset = await UserServices.resetPassword(req.params.userId, req.params.token, req.body.password)
            if(!newPasswordReset) {
                return res.status(400).json({
                    msg: 'failed'
                })
            }
            newPasswordReset.hashPassword = undefined
            return res.status(200).json({
                status: 'success',
                newPasswordReset
            })
        }
        catch(err) {
            return res.status(500).json({
                status: 'failed',
                msg: 'server error' + err
            })
        }
    }

    /**
     * @desc gets a user by its display name
     * @route GET /api/user/:displayName
     * @returns {the user's profile if found}
     */
    static async getUserByDisplayName(req, res) {
        try {
            let user = await UserServices.retrieveUserByDisplayName(req.params.displayName)
            if(!user) {
                return res.status(404).json({
                    status: 'failed',
                    msg: 'User not found'
                })
            }
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

    /**
     * @desc edits and update a use profile
     * @route PUT /api/user/:userId
     * @returns {updated user's profile if successful}
     */
    static async updateUserProfile(req, res) {
        try {
            let user = await UserServices.editUserProfile(req.params.id, req.body)
            if(!user || user.msg) {
                return res.status(400).json({
                    status: 'failed',
                    error: user.msg
                })
            }
            user.hashPassword = undefined
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

    /**
     * @desc deletes a user by its id
     * @route DELETE /api/user/:userId
     */
    static async deleteUser(req, res) {
        try {
            let user = await UserServices.removeUser(req.params.id)
            if(!user) {
                return res.status(400).json({
                    status: 'failed',
                    msg: 'Unable to complete your request'
                })
            }
            return res.status(200).json({
                status: 'success',
                msg: "user's data has been erased successfully"
            })
        } 
        catch(err) {
            res.status(500).json({
                status: 'failed',
                msg: 'server error, please try again'
            })
        }
    }


}