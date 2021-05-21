const Users = require('../models/userSchema')

module.exports = class UserServices{
    static async createUser(firstName, lastName, displayName, email, password, country, tel) {
        let newUser = new Users({
            'firstName': firstName,
            'lastName': lastName,
            'displayName': displayName,
            'email': email,
            'password': password,
            'country': country,
            'tel': tel
        })

        return newUser.save()
    }

    static async retrieveUserByDisplayName(displayName) {
        return Users.findOne({where: { displayName: displayName }})
    }

    static async editUserProfile(displayName, email, password, country, tel, paramsId) {
        return Users.update({
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