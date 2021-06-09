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
                msg: err
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

    /**
     * @route PoST /auth/resetPassword
     * @param {user's email} req 
     * @returns the confirmtion token
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
                msg: newToken
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
     * @route PoST /auth/newPassword
     * @param {user's id} req.params 
     * @param {received Token} req.params
     * @param {new password} req.body
     * @returns user updated profile
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
     *@route GET /api/user/:displayName
     * @param {user's displayName} req
     * @returns the user's profile if found
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
     * 
     * @route PUT /api/user/:userId
     * @param {user's id & profile to be updated} req 
     * @returns updated user's profile if successful
     */
    static async updateUserProfile(req, res) {
        
        try {
            let user = await UserServices.editUserProfile(req.params.id, req.body.displayName, req.body.email, req.body.country, req.body.tel)

            if(!user) {
                return res.status(400).json({
                    status: 'failed',
                    msg: 'cannot be updated!'
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