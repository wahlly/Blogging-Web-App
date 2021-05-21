const UserServices = require('../services/userService')

module.exports = class UserController{

    static async postNewUser(req, res) {

        try {
            let newUser = await UserServices.createUser(req.body.firstName, req.body.lastName, req.body.displayName, req.body.email, req.body.country, req.body.tel)
            return res.status(200).json({
                status: 'success',
                profile: newUser
            })
        } 
        catch (error) {
            return res.status(500).json({
                status: 'failed',
                error
            })
        }

    }

    static async getUserByDisplayName(req, res) {

        try {
            let user = await UserServices.retrieveUserByDisplayName(req.params.displayName)
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